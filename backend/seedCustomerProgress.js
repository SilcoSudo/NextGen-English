const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Progress = require('./models/Progress');
const database = require('./config/database');

// Function to unlock lessons for customer accounts
const unlockLessonsForCustomers = async () => {
  try {
    await database.connect();
    console.log('Connected to database');

    // Get the 3 latest lessons (Colors, Family, Animals)
    const latestLessons = await Lesson.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select('_id title price');

    if (latestLessons.length === 0) {
      console.log('No lessons found');
      await database.disconnect();
      return;
    }

    console.log(`Found ${latestLessons.length} lessons:`);
    latestLessons.forEach(lesson => {
      console.log(`  - ${lesson.title} (${lesson._id})`);
    });

    // Get all customer accounts
    const customers = await User.find({
      username: { $in: ['customer1', 'customer2', 'customer3', 'customer4', 'customer5', 'customer6', 'customer7'] }
    }).select('_id username name');

    if (customers.length === 0) {
      console.log('No customer accounts found');
      await database.disconnect();
      return;
    }

    console.log(`\nFound ${customers.length} customer accounts:`);
    customers.forEach(customer => {
      console.log(`  - ${customer.username} (${customer.name})`);
    });

    // Create progress records for each customer and each lesson
    const progressRecords = [];
    
    for (const customer of customers) {
      for (const lesson of latestLessons) {
        // Check if progress already exists
        const existingProgress = await Progress.findOne({
          userId: customer._id,
          lessonId: lesson._id
        });

        if (existingProgress) {
          console.log(`\n⏭️  Progress already exists for ${customer.username} - ${lesson.title}`);
          continue;
        }

        // Create new progress record with "purchased" status
        const progress = {
          userId: customer._id,
          lessonId: lesson._id,
          status: 'in-progress', // Started but not completed
          progress: 0, // 0% progress
          lastAccessedAt: new Date(),
          paymentInfo: {
            status: 'free', // Marked as free
            amount: 0, // Free - no payment
            paidAt: new Date(),
            method: 'admin-unlock' // Special method for admin unlocks
          }
        };

        progressRecords.push(progress);
      }
    }

    if (progressRecords.length === 0) {
      console.log('\n✅ All lessons already unlocked for all customers');
      await database.disconnect();
      return;
    }

    // Insert all progress records
    await Progress.insertMany(progressRecords);

    console.log(`\n✅ Successfully unlocked ${progressRecords.length} lessons for customers:`);
    console.log(`   - Total customers: ${customers.length}`);
    console.log(`   - Lessons per customer: ${latestLessons.length}`);
    console.log(`   - Total unlocks: ${progressRecords.length}`);
    
    console.log('\n📋 Unlocked lessons:');
    latestLessons.forEach(lesson => {
      console.log(`   ✓ ${lesson.title}`);
    });

    console.log('\n👥 For customers:');
    customers.forEach(customer => {
      console.log(`   ✓ ${customer.username} (${customer.name})`);
    });

    await database.disconnect();
    console.log('\n✅ Disconnected from database');

  } catch (error) {
    console.error('❌ Error unlocking lessons:', error);
    process.exit(1);
  }
};

// Run the unlock function
unlockLessonsForCustomers();
