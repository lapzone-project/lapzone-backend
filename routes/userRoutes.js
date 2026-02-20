const express = require('express');
const router = express.Router();
const { createStaff, getStaffs, deleteStaff } = require('../controllers/authController');
const auth = require('../middleware/auth');
const checkRole = require('../middleware/checkRole');

// All user routes protected for OWNER only
router.use(auth, checkRole(['OWNER']));

router.post('/create-staff', createStaff);
router.get('/staffs', getStaffs);
router.delete('/:id', deleteStaff);

module.exports = router;
