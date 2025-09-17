const Joi = require('joi');
const Category = require('../models/category.model');

// Validation schemas
const categorySchema = Joi.object({
  name: Joi.string().required().max(50),
  description: Joi.string().max(300),
  color: Joi.string().pattern(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/),
  icon: Joi.string().max(50),
  isActive: Joi.boolean(),
});

const updateCategorySchema = categorySchema.fork(['name'], schema =>
  schema.optional()
);

// Generate URL-friendly slug
function generateSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Ensure unique slug
async function ensureUniqueSlug(name, categoryId = null) {
  let slug = generateSlug(name);
  let counter = 1;
  let originalSlug = slug;

  while (true) {
    const query = { slug };
    if (categoryId) query._id = { $ne: categoryId };

    const existingCategory = await Category.findOne(query);
    if (!existingCategory) break;

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
  toggle,
};

// Create a new category
async function create(req, res) {
  try {
    const validatedData = await categorySchema.validateAsync(req.body);

    // Generate unique slug
    const slug = await ensureUniqueSlug(validatedData.name);

    // Set creator to current user
    validatedData.createdBy = req.user._id;
    validatedData.slug = slug;

    const category = new Category(validatedData);
    await category.save();

    // Populate creator
    await category.populate('createdBy', 'fullname email');

    res.status(201).json({
      message: 'Category created successfully',
      category,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get all categories
async function getAll(req, res) {
  try {
    const filter = {};

    // Add filters
    if (req.query.active !== undefined) {
      filter.isActive = req.query.active === 'true';
    }

    const sort = {};
    switch (req.query.sort) {
      case 'name':
        sort.name = 1;
        break;
      case 'newest':
        sort.createdAt = -1;
        break;
      case 'oldest':
        sort.createdAt = 1;
        break;
      default:
        sort.name = 1;
    }

    const categories = await Category.find(filter)
      .populate('createdBy', 'fullname email')
      .populate('blogCount')
      .sort(sort);

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get category by ID
async function getById(req, res) {
  try {
    const category = await Category.findById(req.params.id)
      .populate('createdBy', 'fullname email')
      .populate('blogCount');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Get category by slug
async function getBySlug(req, res) {
  try {
    const category = await Category.findOne({ slug: req.params.slug })
      .populate('createdBy', 'fullname email')
      .populate('blogCount');

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Update category
async function update(req, res) {
  try {
    const validatedData = await updateCategorySchema.validateAsync(req.body);

    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    // Update slug if name changed
    if (validatedData.name && validatedData.name !== category.name) {
      validatedData.slug = await ensureUniqueSlug(
        validatedData.name,
        category._id
      );
    }

    Object.assign(category, validatedData);
    await category.save();

    await category.populate('createdBy', 'fullname email');

    res.json({
      message: 'Category updated successfully',
      category,
    });
  } catch (error) {
    if (error.isJoi) {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.details.map(detail => detail.message),
      });
    }
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Category name already exists' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Delete category
async function remove(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

// Toggle category active status
async function toggle(req, res) {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Admin access required' });
    }

    category.isActive = !category.isActive;
    await category.save();

    res.json({
      message: `Category ${
        category.isActive ? 'activated' : 'deactivated'
      } successfully`,
      category,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
