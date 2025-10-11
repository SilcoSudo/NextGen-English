const mongoose = require('mongoose');
const Lesson = require('./models/Lesson');

async function updateImageUrls() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/nextgen_english');
    console.log('✅ Connected to MongoDB');

    // Find lessons with localhost URLs
    const lessons = await Lesson.find({
      $or: [
        { thumbnailUrl: { $regex: 'localhost:5000' } },
        { videoUrl: { $regex: 'localhost:5000' } }
      ]
    });

    console.log(`📝 Found ${lessons.length} lessons with localhost URLs`);

    // Update each lesson
    for (const lesson of lessons) {
      const updates = {};
      
      if (lesson.thumbnailUrl && lesson.thumbnailUrl.includes('localhost:5000')) {
        updates.thumbnailUrl = lesson.thumbnailUrl.replace(
          'http://localhost:5000',
          'https://nextgenenglish.id.vn'
        );
        console.log(`📸 Updating thumbnail: ${lesson.title}`);
      }
      
      if (lesson.videoUrl && lesson.videoUrl.includes('localhost:5000')) {
        updates.videoUrl = lesson.videoUrl.replace(
          'http://localhost:5000',
          'https://nextgenenglish.id.vn'
        );
        console.log(`🎥 Updating video: ${lesson.title}`);
      }

      if (Object.keys(updates).length > 0) {
        await Lesson.findByIdAndUpdate(lesson._id, updates);
        console.log(`✅ Updated: ${lesson.title}`);
      }
    }

    console.log('🎉 Database update completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

updateImageUrls();