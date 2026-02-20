import express from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  updateStock 
} from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', getProducts);
router.get('/:id', getProductById);

// Protected routes (Staff + Owner)
router.post('/', auth, checkRole(['STAFF', 'OWNER']), upload.array('images', 5), createProduct);
router.put('/:id', auth, checkRole(['STAFF', 'OWNER']), upload.array('images', 5), updateProduct);
router.patch('/:id/stock', auth, checkRole(['STAFF', 'OWNER']), updateStock);

// Owner only routes
router.delete('/:id', auth, checkRole(['OWNER']), deleteProduct);

export default router;
