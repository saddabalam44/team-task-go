import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: [path.resolve(__dirname, '../.env'), path.resolve(__dirname, '.env')] });

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to DB');

    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared all existing credentials, projects, and tasks');

    const admin = new User({
      name: 'System Admin',
      email: 'admin@gmail.com',
      password: 'admin@12345',
      role: 'Admin'
    });

    await admin.save();
    console.log('Default admin created: admin@gmail.com / admin@12345');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
