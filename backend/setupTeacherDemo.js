const mongoose = require('mongoose');
const User = require('./models/UserMongoDB');
const Course = require('./models/Course');
require('dotenv').config();

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nextgen-english');
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Create demo teacher account
const createTeacherAccount = async () => {
  try {
    console.log('\n📝 Creating teacher account...');
    
    // Check if teacher already exists
    const existingTeacher = await User.findOne({ email: 'teacher@nextgen.com' });
    
    if (!existingTeacher) {
      const teacher = new User({
        name: 'Giảng Viên Demo',
        username: 'teacher_demo',
        email: 'teacher@nextgen.com',
        password: 'Teacher123!',
        role: 'teacher',
        isActive: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      });
      
      await teacher.save();
      console.log('✅ Teacher account created:');
      console.log('   📧 Email: teacher@nextgen.com');
      console.log('   🔑 Password: Teacher123!');
      console.log('   👤 Role: teacher');
    } else {
      // Update existing teacher
      existingTeacher.role = 'teacher';
      await existingTeacher.save();
      console.log('✅ Updated existing teacher account');
    }
    
    // Also update the existing user to teacher role
    await User.updateOne(
      { email: 'sirogaming001@gmail.com' },
      { role: 'teacher' }
    );
    console.log('✅ Updated sirogaming001@gmail.com to teacher role');
    
  } catch (error) {
    console.error('❌ Error creating teacher account:', error);
  }
};

// Create demo courses
const createDemoCourses = async () => {
  try {
    console.log('\n📚 Creating demo courses...');
    
    // Find teacher
    const teacher = await User.findOne({ email: 'teacher@nextgen.com' });
    if (!teacher) {
      console.log('❌ Teacher not found, skipping course creation');
      return;
    }
    
    // Demo courses data
    const demoCourses = [
      {
        title: 'English Grammar Fundamentals',
        description: 'Học ngữ pháp tiếng Anh cơ bản từ A đến Z. Khóa học này sẽ giúp bạn nắm vững các quy tắc ngữ pháp quan trọng nhất trong tiếng Anh.',
        level: 'beginner',
        duration: 120,
        price: 299000,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=300&h=200&fit=crop',
        objectives: [
          'Hiểu và sử dụng các thì cơ bản trong tiếng Anh',
          'Phân biệt các loại từ và cách sử dụng',
          'Tạo câu đơn và câu phức chính xác',
          'Sử dụng đúng trật tự từ trong câu'
        ],
        prerequisites: [
          'Biết bảng chữ cái tiếng Anh',
          'Có từ vựng cơ bản khoảng 500 từ'
        ],
        instructor: teacher._id,
        status: 'published'
      },
      {
        title: 'Business English Communication',
        description: 'Khóa học tiếng Anh giao tiếp trong môi trường công sở. Phù hợp cho những người đang làm việc hoặc chuẩn bị bước vào môi trường doanh nghiệp.',
        level: 'intermediate',
        duration: 90,
        price: 499000,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=300&h=200&fit=crop',
        objectives: [
          'Giao tiếp tự tin trong các cuộc họp',
          'Viết email chuyên nghiệp',
          'Thuyết trình bằng tiếng Anh',
          'Đàm phán và thương lượng'
        ],
        prerequisites: [
          'Có trình độ tiếng Anh cơ bản',
          'Đã học qua ngữ pháp căn bản'
        ],
        instructor: teacher._id,
        status: 'published'
      },
      {
        title: 'IELTS Speaking Mastery',
        description: 'Khóa học chuyên sâu về kỹ năng Speaking trong kỳ thi IELTS. Phương pháp học hiệu quả với nhiều bài tập thực hành.',
        level: 'advanced',
        duration: 150,
        price: 799000,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300&h=200&fit=crop',
        objectives: [
          'Đạt band 7.0+ trong IELTS Speaking',
          'Tự tin trả lời các câu hỏi phức tạp',
          'Sử dụng từ vựng và cấu trúc câu nâng cao',
          'Cải thiện phát âm và intonation'
        ],
        prerequisites: [
          'Trình độ tiếng Anh trung cấp',
          'Đã có kiến thức về format IELTS'
        ],
        instructor: teacher._id,
        status: 'draft'
      },
      {
        title: 'English Pronunciation Workshop',
        description: 'Hội thảo cải thiện phát âm tiếng Anh. Học cách phát âm chuẩn các âm thanh khó trong tiếng Anh.',
        level: 'intermediate',
        duration: 60,
        price: 199000,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop',
        objectives: [
          'Phát âm chuẩn các âm /θ/, /ð/, /r/, /l/',
          'Cải thiện trọng âm từ và câu',
          'Luyện tập intonation tự nhiên'
        ],
        prerequisites: [
          'Biết đọc phiên âm IPA cơ bản'
        ],
        instructor: teacher._id,
        status: 'published'
      },
      {
        title: 'Academic Writing for IELTS',
        description: 'Khóa học viết luận IELTS Academic. Hướng dẫn chi tiết cách viết Task 1 và Task 2 đạt điểm cao.',
        level: 'advanced',
        duration: 180,
        price: 899000,
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        thumbnailUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop',
        objectives: [
          'Viết được bài luận hoàn chỉnh trong 40 phút',
          'Sử dụng linking words hiệu quả',
          'Phân tích và diễn giải biểu đồ, bảng số liệu',
          'Phát triển ý tưởng logic và mạch lạc'
        ],
        prerequisites: [
          'Trình độ tiếng Anh trung cấp khá',
          'Đã biết cấu trúc bài viết cơ bản'
        ],
        instructor: teacher._id,
        status: 'draft'
      }
    ];
    
    // Delete existing demo courses
    await Course.deleteMany({ instructor: teacher._id });
    
    // Create new courses
    for (const courseData of demoCourses) {
      const course = new Course(courseData);
      await course.save();
      console.log(`✅ Created course: ${course.title}`);
    }
    
    console.log(`\n📊 Created ${demoCourses.length} demo courses`);
    
  } catch (error) {
    console.error('❌ Error creating demo courses:', error);
  }
};

// Display summary
const displaySummary = async () => {
  try {
    console.log('\n🎯 SETUP SUMMARY');
    console.log('================');
    
    const teachers = await User.find({ role: 'teacher' });
    console.log(`👨‍🏫 Teachers: ${teachers.length}`);
    
    for (const teacher of teachers) {
      const courses = await Course.find({ instructor: teacher._id });
      const published = courses.filter(c => c.status === 'published').length;
      const drafts = courses.filter(c => c.status === 'draft').length;
      
      console.log(`\n👤 ${teacher.name} (${teacher.email})`);
      console.log(`   📚 Total courses: ${courses.length}`);
      console.log(`   ✅ Published: ${published}`);
      console.log(`   📝 Drafts: ${drafts}`);
    }
    
    console.log('\n🚀 NEXT STEPS:');
    console.log('1. Start backend: cd backend && yarn start');
    console.log('2. Start frontend: cd frontend && npm start');
    console.log('3. Login as teacher: teacher@nextgen.com / Teacher123!');
    console.log('4. Go to: http://localhost:3000/#/teacher');
    
  } catch (error) {
    console.error('❌ Error displaying summary:', error);
  }
};

// Main execution
const main = async () => {
  console.log('🎓 NextGen English - Teacher Demo Setup');
  console.log('=======================================');
  
  await connectDB();
  await createTeacherAccount();
  await createDemoCourses();
  await displaySummary();
  
  process.exit(0);
};

main().catch(error => {
  console.error('❌ Setup failed:', error);
  process.exit(1);
});