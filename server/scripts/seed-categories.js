const Category = require('../models/category.model');

const defaultCategories = [
  {
    name: 'Technology',
    slug: 'technology',
    description:
      'Articles about technology, programming, and software development',
    color: '#2196F3',
    icon: 'code',
    createdBy: null, // Will be set to admin user later
  },
  {
    name: 'Web Development',
    slug: 'web-development',
    description: 'Frontend and backend web development tutorials and tips',
    color: '#4CAF50',
    icon: 'web',
    createdBy: null,
  },
  {
    name: 'Tutorial',
    slug: 'tutorial',
    description: 'Step-by-step tutorials and how-to guides',
    color: '#FF9800',
    icon: 'school',
    createdBy: null,
  },
  {
    name: 'News',
    slug: 'news',
    description: 'Latest news and updates from the tech world',
    color: '#F44336',
    icon: 'article',
    createdBy: null,
  },
  {
    name: 'Tips & Tricks',
    slug: 'tips-tricks',
    description: 'Useful tips and tricks for developers',
    color: '#9C27B0',
    icon: 'lightbulb',
    createdBy: null,
  },
];

async function seedCategories() {
  try {
    console.log('🌱 Seeding categories...');

    // Check if categories already exist
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('✅ Categories already exist, skipping seed');
      return;
    }

    // Create categories one by one to handle validation
    const createdCategories = [];
    for (const categoryData of defaultCategories) {
      try {
        const category = new Category(categoryData);
        // Skip validation for createdBy field during seeding
        category.save({ validateBeforeSave: false });
        createdCategories.push(category);
      } catch (error) {
        console.warn(
          `⚠️ Could not create category ${categoryData.name}:`,
          error.message
        );
      }
    }

    console.log(
      `✅ Successfully created ${createdCategories.length} categories:`
    );
    createdCategories.forEach(cat => {
      console.log(`   - ${cat.name}`);
    });
  } catch (error) {
    console.error('❌ Error seeding categories:', error.message);
  }
}

module.exports = seedCategories;
