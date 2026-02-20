import express from 'express';
import { createStaff, getStaffs, deleteStaff } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';

const router = express.Router();

// All user routes protected for OWNER only
router.use(auth, checkRole(['OWNER']));

router.post('/create-staff', createStaff);
router.get('/staffs', getStaffs);
router.delete('/:id', deleteStaff);

export default router;
