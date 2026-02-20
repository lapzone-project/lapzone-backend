const express = require('express');
const router = express.Router();
const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateStock 
} = require('../controllers/productController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');
const { upload } = require('../utils/cloudinary');

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Staff + Owner)
router.post('/', auth, checkRole(['STAFF', 'OWNER']), upload.array('images', 5), createProduct);
router.put('/:id', auth, checkRole(['STAFF', 'OWNER']), upload.array('images', 5), updateProduct);
router.patch('/:id/stock', auth, checkRole(['STAFF', 'OWNER']), updateStock);

// Owner only routes
router.delete('/:id', auth, checkRole(['OWNER']), deleteProduct);

module.exports = router;
