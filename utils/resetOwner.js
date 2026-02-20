import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const resetOwner = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const newPassword = process.env.NEW_PASS;
    if (!newPassword) {
      throw new Error('Please provide NEW_PASS in your environment command (e.g., $env:NEW_PASS="NewPass"; npm run reset-owner)');
    }

    const owner = await User.findOne({ role: 'OWNER' });
    if (!owner) {
      console.log('❌ No OWNER account found to update');
      process.exit();
    }

    owner.password = newPassword; // Hook handles hashing
    await owner.save();

    console.log('✅ Owner password updated successfully');
    process.exit();
  } catch (error) {
    console.error('❌ Error updating owner:', error.message);
    process.exit(1);
  }
};

resetOwner();
