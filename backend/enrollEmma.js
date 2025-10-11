const mongoose = require('mongoose');
const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Progress = require('./models/Progress');

async function enrollEmmaInLesson() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nextgen_english');
    console.log('✅ Connected to MongoDB');

    // Find Emma user
    const emma = await User.findOne({ 
      $or: [
        { email: /emma/i },
        { username: /emma/i },
        { name: /emma/i }
      ]
    });

    if (!emma) {
      console.log('❌ Emma user not found');
      console.log('📝 Creating Emma user...');
      
      const newEmma = new User({
        username: 'emma',
        email: 'emma@example.com',
        password: '$2b$10$dummy.hash.for.emma', // Dummy hash
        name: 'Emma Student',
        role: 'student',
        isVerified: true
      });
      
      await newEmma.save();
      console.log('✅ Emma user created');
      emma = newEmma;
    } else {
      console.log(`✅ Found user: ${emma.name || emma.username} (${emma.email})`);
    }

    // Find Colors with Lily lesson
    const lesson = await Lesson.findOne({ 
      title: /colors.*lily/i 
    });

    if (!lesson) {
      console.log('❌ Colors with Lily lesson not found');
      const allLessons = await Lesson.find({}, { title: 1 });
      console.log('Available lessons:', allLessons.map(l => l.title));
      process.exit(1);
    }

    console.log(`✅ Found lesson: ${lesson.title}`);

    // Check if already enrolled
    const existingProgress = await Progress.findOne({
      userId: emma._id,
      lessonId: lesson._id
    });

    if (existingProgress) {
      console.log('📚 Emma is already enrolled in this lesson');
    } else {
      // Create progress record (enrollment)
      const progress = new Progress({
        userId: emma._id,
        lessonId: lesson._id,
        progress: 0,
        completed: false,
        enrolledAt: new Date()
      });

      await progress.save();
      console.log('🎉 Emma has been enrolled in "Colors with Lily"!');
    }

    // Add to user's enrolledLessons if not already there
    if (!emma.enrolledLessons) {
      emma.enrolledLessons = [];
    }
    
    if (!emma.enrolledLessons.includes(lesson._id)) {
      emma.enrolledLessons.push(lesson._id);
      await emma.save();
      console.log('✅ Added lesson to Emma\'s enrolled lessons');
    }

    console.log('🎯 Enrollment completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

enrollEmmaInLesson();