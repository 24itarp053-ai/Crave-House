const Category = require('../models/Category');

/**
 * Fetch all active categories
 * GET /api/categories
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Fetch single category by slug
 * GET /api/categories/:slug
 */
const getCategoryBySlug = async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug.toLowerCase().trim(),
      isActive: true
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.status(200).json({
      success: true,
      category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getCategoryBySlug
};
