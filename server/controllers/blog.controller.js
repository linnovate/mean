const Joi = require('joi');
const Blog = require('../models/blog.model');
const Category = require('../models/category.model');

// Validation schemas
const blogSchema = Joi.object({
  title: Joi.string().required().max(200),
  slug: Joi.string()
    .pattern(/^[a-z0-9-]+$/)
    .max(200)
    .optional(),
  content: Joi.string().required(),
  excerpt: Joi.string().max(500),
  featuredImage: Joi.string().uri().allow(''),
  categories: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)),
  tags: Joi.array().items(Joi.string().max(30)),
  status: Joi.string().valid('draft', 'published', 'scheduled'),
  publishedAt: Joi.date(),
  scheduledAt: Joi.date(),
  metaTitle: Joi.string().max(60),
  metaDescription: Joi.string().max(160),
  metaKeywords: Joi.array().items(Joi.string()),
  isFeatured: Joi.boolean(),
  allowComments: Joi.boolean(),
});

const updateBlogSchema = blogSchema.fork(['title', 'content'], schema =>
  schema.optional()
);

// Generate URL-friendly slug
function generateSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensure unique slug
async function ensureUniqueSlug(title, blogId = null) {
  let slug = generateSlug(title);
  let counter = 1;
  let originalSlug = slug;

  while (true) {
    const query = { slug };
    if (blogId) query._id = { $ne: blogId };

    const existingBlog = await Blog.findOne(query);
    if (!existingBlog) break;

    slug = `${originalSlug}-${counter}`;
    counter++;
  }

  return slug;
}

module.exports = {
  create,
  getAll,
  getById,
  getBySlug,
  update,
  remove,
  toggleLike,
  incrementViews,
  getByCategory,
  getByTag,
  getFeatured,
  getPublished,
  getDrafts,
  getScheduled,
  publish,
  schedule,
  search,
};

// Create a new blog post
async function create(req, res) {
  try {
    console.log('Creating blog with user:', {
      id: req.user._id,
      roles: req.user.roles,
      hasRoles: !!req.user.roles,
      isAdmin: req.user.isAdmin,
    });

    const validatedData = await blogSchema.validateAsync(req.body);

    // Generate unique slug from custom slug or title
    const baseSlug = validatedData.slug || validatedData.title;
    const slug = await ensureUniqueSlug(baseSlug);

    // Set author to current user
    validatedData.author = req.user._id;
    validatedData.slug = slug;

    // Auto-generate excerpt if not provided
    if (!validatedData.excerpt && validatedData.content) {
      validatedData.excerpt =
        validatedData.content
          .replace(/<[^>]*>/g, '') // Remove HTML tags
          .substring(0, 200) + '...';
    }

    // Set publishedAt if status is published
    if (validatedData.status === 'published' && !validatedData.publishedAt) {
      validatedData.publishedAt = new Date();
    }

    const blog = new Blog(validatedData);
    await blog.save();

    // Populate author and categories
    await blog.populate([
      { path: 'author', select: 'fullname email' },
      { path: 'categories', select: 'name slug color' },
    ]);

    res.status(201).json({
      message: 'Blog post created successfully',
      blog,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get all blog posts with pagination and filters
async function getAll(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};

    // Add filters
    if (req.query.status) filter.status = req.query.status;
    if (req.query.author) filter.author = req.query.author;
    if (req.query.category) filter.categories = req.query.category;
    if (req.query.tag) filter.tags = { $in: [req.query.tag] };
    if (req.query.featured) filter.isFeatured = req.query.featured === 'true';

    // Date range filter
    if (req.query.startDate || req.query.endDate) {
      filter.createdAt = {};
      if (req.query.startDate)
        filter.createdAt.$gte = new Date(req.query.startDate);
      if (req.query.endDate)
        filter.createdAt.$lte = new Date(req.query.endDate);
    }

    const sort = {};
    switch (req.query.sort) {
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      case 'popular':
        sort.views = -1;
        break;
      case 'title':
        sort.title = 1;
        break;
      default:
        sort.createdAt = -1;
    }

    const blogs = await Blog.find(filter)
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .populate('commentCount')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get blog by ID
async function getById(req, res) {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .populate('commentCount');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get blog by slug (SEO-friendly URL)
async function getBySlug(req, res) {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .populate('commentCount');

    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update blog post
async function update(req, res) {
  try {
    const validatedData = await updateBlogSchema.validateAsync(req.body);

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this post' });
    }

    // Update slug if title changed or slug was provided
    if (validatedData.title && validatedData.title !== blog.title) {
      validatedData.slug = await ensureUniqueSlug(
        validatedData.title,
        blog._id
      );
    } else if (validatedData.slug && validatedData.slug !== blog.slug) {
      validatedData.slug = await ensureUniqueSlug(validatedData.slug, blog._id);
    }

    // Handle status changes
    if (validatedData.status === 'published' && blog.status !== 'published') {
      validatedData.publishedAt = new Date();
    }

    // Auto-generate excerpt if content changed and no excerpt provided
    if (validatedData.content && !validatedData.excerpt) {
      validatedData.excerpt =
        validatedData.content.replace(/<[^>]*>/g, '').substring(0, 200) + '...';
    }

    Object.assign(blog, validatedData);
    await blog.save();

    await blog.populate([
      { path: 'author', select: 'fullname email' },
      { path: 'categories', select: 'name slug color' },
    ]);

    res.json({
      message: 'Blog post updated successfully',
      blog,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete blog post
async function remove(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this post' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Toggle like on blog post
async function toggleLike(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const userId = req.user._id;
    const isLiked = blog.likes.includes(userId);

    if (isLiked) {
      blog.likes.pull(userId);
    } else {
      blog.likes.push(userId);
    }

    await blog.save();

    res.json({
      message: isLiked ? 'Blog post unliked' : 'Blog post liked',
      isLiked: !isLiked,
      likesCount: blog.likes.length,
      likes: blog.likes,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Increment views
async function incrementViews(req, res) {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
    res.json({ message: 'Views incremented' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get blogs by category
async function getByCategory(req, res) {
  try {
    const { slug } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const blogs = await Blog.find({
      categories: category._id,
      status: 'published',
    })
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({
      categories: category._id,
      status: 'published',
    });

    res.json({
      category,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get blogs by tag
async function getByTag(req, res) {
  try {
    const { tag } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const blogs = await Blog.find({
      tags: tag,
      status: 'published',
    })
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({
      tags: tag,
      status: 'published',
    });

    res.json({
      tag,
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get featured blogs
async function getFeatured(req, res) {
  try {
    const limit = parseInt(req.query.limit) || 5;

    const blogs = await Blog.find({
      isFeatured: true,
      status: 'published',
    })
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .sort({ publishedAt: -1 })
      .limit(limit);

    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get published blogs
async function getPublished(req, res) {
  try {
    req.query.status = 'published';
    await getAll(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get draft blogs
async function getDrafts(req, res) {
  try {
    req.query.status = 'draft';
    req.query.author = req.user._id; // Only user's own drafts
    await getAll(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get scheduled blogs
async function getScheduled(req, res) {
  try {
    req.query.status = 'scheduled';
    await getAll(req, res);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Publish blog immediately
async function publish(req, res) {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to publish this post' });
    }

    blog.status = 'published';
    blog.publishedAt = new Date();
    blog.scheduledAt = null;

    await blog.save();

    res.json({
      message: 'Blog post published successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Schedule blog for future publication
async function schedule(req, res) {
  try {
    const { scheduledAt } = req.body;
    const scheduledDate = new Date(scheduledAt);

    if (scheduledDate <= new Date()) {
      return res
        .status(400)
        .json({ message: 'Scheduled date must be in the future' });
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    // Check if user is author or admin
    if (
      blog.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to schedule this post' });
    }

    blog.status = 'scheduled';
    blog.scheduledAt = scheduledDate;
    blog.publishedAt = null;

    await blog.save();

    res.json({
      message: 'Blog post scheduled successfully',
      blog,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Search blogs
async function search(req, res) {
  try {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const searchRegex = new RegExp(q, 'i');
    const filter = {
      status: 'published',
      $or: [
        { title: searchRegex },
        { content: searchRegex },
        { excerpt: searchRegex },
        { tags: searchRegex },
      ],
    };

    const blogs = await Blog.find(filter)
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'categories', select: 'name slug color' },
      ])
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Blog.countDocuments(filter);

    res.json({
      query: q,
      blogs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
