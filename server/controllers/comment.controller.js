const Joi = require('joi');
const Comment = require('../models/comment.model');
const Blog = require('../models/blog.model');

// Validation schemas
const commentSchema = Joi.object({
  content: Joi.string().required().max(1000),
  blog: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  parentComment: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
});

const updateCommentSchema = Joi.object({
  content: Joi.string().required().max(1000),
});

const moderateCommentSchema = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  moderationReason: Joi.string().max(200),
});

module.exports = {
  create,
  getByBlog,
  getById,
  update,
  remove,
  moderate,
  toggleLike,
  getPending,
  getByUser,
};

// Create a new comment
async function create(req, res) {
  try {
    const validatedData = await commentSchema.validateAsync(req.body);

    // Check if blog exists and allows comments
    const blog = await Blog.findById(validatedData.blog);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    if (!blog.allowComments) {
      return res
        .status(403)
        .json({ message: 'Comments are disabled for this post' });
    }

    // Check if parent comment exists (for replies)
    if (validatedData.parentComment) {
      const parentComment = await Comment.findById(validatedData.parentComment);
      if (!parentComment) {
        return res.status(404).json({ message: 'Parent comment not found' });
      }
      if (parentComment.blog.toString() !== validatedData.blog) {
        return res
          .status(400)
          .json({ message: 'Parent comment belongs to different blog post' });
      }
    }

    // Set author to current user
    validatedData.author = req.user._id;

    // Auto-approve comments from admins
    if (req.user.isAdmin) {
      validatedData.status = 'approved';
    }

    const comment = new Comment(validatedData);
    await comment.save();

    // Populate author
    await comment.populate([
      { path: 'author', select: 'fullname email' },
      { path: 'parentComment', select: 'content author' },
    ]);

    res.status(201).json({
      message: 'Comment created successfully',
      comment,
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

// Get comments for a blog post
async function getByBlog(req, res) {
  try {
    const { blogId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Check if blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog post not found' });
    }

    const filter = { blog: blogId };

    // Only show approved comments to non-admins
    if (!req.user?.isAdmin) {
      filter.status = 'approved';
    } else if (req.query.status) {
      filter.status = req.query.status;
    }

    // Get top-level comments (not replies)
    if (req.query.topLevel === 'true') {
      filter.parentComment = null;
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
        sort.likes = -1;
        break;
      default:
        sort.createdAt = -1;
    }

    const comments = await Comment.find(filter)
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'moderatedBy', select: 'fullname email' },
        { path: 'parentComment', select: 'content author' },
      ])
      .populate('replyCount')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(filter);

    res.json({
      comments,
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

// Get comment by ID
async function getById(req, res) {
  try {
    const comment = await Comment.findById(req.params.id)
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'blog', select: 'title slug' },
        { path: 'moderatedBy', select: 'fullname email' },
        { path: 'parentComment', select: 'content author' },
      ])
      .populate('replyCount');

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check permissions
    if (
      comment.status !== 'approved' &&
      !req.user?.isAdmin &&
      comment.author._id.toString() !== req.user?._id.toString()
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update comment
async function update(req, res) {
  try {
    const validatedData = await updateCommentSchema.validateAsync(req.body);

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is author or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to update this comment' });
    }

    // Only allow editing within 15 minutes of creation (unless admin)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    if (!req.user.isAdmin && comment.createdAt < fifteenMinutesAgo) {
      return res
        .status(403)
        .json({
          message: 'Comment can only be edited within 15 minutes of creation',
        });
    }

    comment.content = validatedData.content;
    comment.isEdited = true;
    comment.editedAt = new Date();

    // Reset status to pending if not admin
    if (!req.user.isAdmin && comment.status === 'approved') {
      comment.status = 'pending';
    }

    await comment.save();

    await comment.populate([
      { path: 'author', select: 'fullname email' },
      { path: 'moderatedBy', select: 'fullname email' },
    ]);

    res.json({
      message: 'Comment updated successfully',
      comment,
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

// Delete comment
async function remove(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is author or admin
    if (
      comment.author.toString() !== req.user._id.toString() &&
      !req.user.isAdmin
    ) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this comment' });
    }

    // Delete all replies to this comment
    await Comment.deleteMany({ parentComment: comment._id });

    // Delete the comment
    await Comment.findByIdAndDelete(req.params.id);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Moderate comment (admin only)
async function moderate(req, res) {
  try {
    const validatedData = await moderateCommentSchema.validateAsync(req.body);

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    comment.status = validatedData.status;
    comment.moderatedBy = req.user._id;
    comment.moderatedAt = new Date();
    if (validatedData.moderationReason) {
      comment.moderationReason = validatedData.moderationReason;
    }

    await comment.save();

    await comment.populate([
      { path: 'author', select: 'fullname email' },
      { path: 'moderatedBy', select: 'fullname email' },
    ]);

    res.json({
      message: `Comment ${validatedData.status} successfully`,
      comment,
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

// Toggle like on comment
async function toggleLike(req, res) {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const userId = req.user._id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();

    res.json({
      message: isLiked ? 'Comment unliked' : 'Comment liked',
      isLiked: !isLiked,
      likesCount: comment.likes.length,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get pending comments (admin only)
async function getPending(req, res) {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ status: 'pending' })
      .populate([
        { path: 'author', select: 'fullname email' },
        { path: 'blog', select: 'title slug' },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments({ status: 'pending' });

    res.json({
      comments,
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

// Get comments by user
async function getByUser(req, res) {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Users can only see their own comments unless admin
    if (userId !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const filter = { author: userId };

    // Add status filter for admins
    if (req.user.isAdmin && req.query.status) {
      filter.status = req.query.status;
    } else if (!req.user.isAdmin) {
      // Non-admins see all their comments regardless of status
    }

    const comments = await Comment.find(filter)
      .populate([
        { path: 'blog', select: 'title slug' },
        { path: 'moderatedBy', select: 'fullname email' },
      ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Comment.countDocuments(filter);

    res.json({
      comments,
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
