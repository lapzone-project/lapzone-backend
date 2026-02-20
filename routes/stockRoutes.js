import express from 'express';
import { getStockLogs } from '../controllers/productController.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// Owner only - view stock history/logs
router.get('/logs', auth, checkRole(['OWNER']), getStockLogs);

export default router;
