import express from 'express';
import { createStaff, getStaffs, deleteStaff } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import checkRole from '../middleware/checkRole.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// All user routes protected for OWNER only
router.use(auth, checkRole(['OWNER']));

router.post('/create-staff', upload.single('image'), createStaff);
router.get('/staffs', getStaffs);
router.delete('/:id', deleteStaff);

export default router;
