const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const database = require('./config/database');

// Customer experience accounts
const customerExperienceAccounts = [
  {
    name: 'Customer 1',
    username: 'customer1',
    email: 'customer1@nextgen.com',
    password: 'customer123', // Note: Password for Customer 1
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#FF5733","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 25,
      level: 'beginner',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'en'
    }
  },
  {
    name: 'Customer 2',
    username: 'customer2',
    email: 'customer2@nextgen.com',
    password: 'customer123', // Note: Password for Customer 2
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#4CAF50","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 30,
      level: 'intermediate',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    }
  },
  {
    name: 'Customer 3',
    username: 'customer3',
    email: 'customer3@nextgen.com',
    password: 'customer123', // Note: Password for Customer 3
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#2196F3","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 20,
      level: 'beginner',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'en'
    }
  },
  {
    name: 'Customer 4',
    username: 'customer4',
    email: 'customer4@nextgen.com',
    password: 'customer123', // Note: Password for Customer 4
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#FFC107","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 35,
      level: 'advanced',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    }
  },
  {
    name: 'Customer 5',
    username: 'customer5',
    email: 'customer5@nextgen.com',
    password: 'customer123', // Note: Password for Customer 5
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#9C27B0","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 28,
      level: 'intermediate',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'en'
    }
  },
  {
    name: 'Customer 6',
    username: 'customer6',
    email: 'customer6@nextgen.com',
    password: 'customer123', // Note: Password for Customer 6
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#E91E63","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 22,
      level: 'beginner',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    }
  },
  {
    name: 'Customer 7',
    username: 'customer7',
    email: 'customer7@nextgen.com',
    password: 'customer123', // Note: Password for Customer 7
    role: 'student',
    avatar: 'icon:{"iconName":"FaSmile","color":"#FF9800","name":"Customer"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 40,
      level: 'advanced',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'en'
    }
  }
];

// Function to seed customer experience accounts
const seedCustomerExperienceAccounts = async () => {
  try {
    await database.connect();
    console.log('Connected to database');

    // Delete existing customer accounts first
    const deleteResult = await User.deleteMany({
      username: { $in: ['customer1', 'customer2', 'customer3', 'customer4', 'customer5', 'customer6', 'customer7'] }
    });
    console.log(`Deleted ${deleteResult.deletedCount} existing customer accounts`);

    // Insert customer experience accounts one by one to trigger pre-save hook for password hashing
    console.log('Creating customer accounts with hashed passwords...');
    for (const accountData of customerExperienceAccounts) {
      const user = new User(accountData);
      await user.save(); // This will trigger the pre-save middleware to hash password
      console.log(`  ✓ Created ${user.username}`);
    }
    
    console.log(`\n✅ Successfully created ${customerExperienceAccounts.length} customer accounts`);

    await database.disconnect();
    console.log('Disconnected from database');
  } catch (error) {
    console.error('Error seeding customer experience accounts:', error);
    process.exit(1);
  }
};

seedCustomerExperienceAccounts();