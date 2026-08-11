const express = require('express');
const router = express.Router();
const {
  getMenuItems,
  getMenuItemsByCategory,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  updateMenuItemAvailability,
  deleteMenuItem
} = require('../controllers/menuController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public read-only endpoints
router.get('/', getMenuItems);
router.get('/category/:slug', getMenuItemsByCategory);
router.get('/:id', getMenuItemById);

// Protected menu management endpoints
router.post('/', protect, authorize('admin', 'owner'), createMenuItem);
router.put('/:id', protect, authorize('admin', 'owner'), updateMenuItem);
router.patch('/:id/availability', protect, authorize('admin', 'owner'), updateMenuItemAvailability);
router.delete('/:id', protect, authorize('admin'), deleteMenuItem);

module.exports = router;
