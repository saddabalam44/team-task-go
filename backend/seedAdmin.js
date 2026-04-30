import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';

dotenv.config();

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
      password: 'Admin@123',
      role: 'Admin'
    });
    
    await admin.save();
    console.log('Default admin created: admin@gmail.com / Admin@123');
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
