const express = require('express');
const router = express.Router();
const { getStockLogs } = require('../controllers/productController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// Owner only - view stock history/logs
router.get('/logs', auth, checkRole(['OWNER']), getStockLogs);

module.exports = router;
