const express = require('express');
const router = express.Router();
const { getMenuItems, getMenuItemsByCategory, getMenuItemById } = require('../controllers/menuController');

router.get('/', getMenuItems);
router.get('/category/:slug', getMenuItemsByCategory);
router.get('/:id', getMenuItemById);

module.exports = router;
