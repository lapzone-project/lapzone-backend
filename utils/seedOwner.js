import mongoose from 'mongoose';
import User from '../models/User.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Explicitly load .env from the root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

const seedOwner = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const ownerExists = await User.findOne({ role: 'OWNER' });
    if (ownerExists) {
      console.log('✅ Owner account already exists');
      process.exit();
    }

    const { OWNER_NAME, OWNER_EMAIL, OWNER_PASSWORD } = process.env;

    if (!OWNER_NAME || !OWNER_EMAIL || !OWNER_PASSWORD) {
      throw new Error('Owner credentials (NAME, EMAIL, PASSWORD) are not fully defined in .env');
    }

    const owner = new User({
      name: OWNER_NAME,
      email: OWNER_EMAIL,
      password: OWNER_PASSWORD, // Hashing is handled by the model's pre-save hook
      role: 'OWNER'
    });

    await owner.save();
    console.log('✅ Owner created securely from .env');
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding owner:', error.message);
    process.exit(1);
  }
};

seedOwner();
