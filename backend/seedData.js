const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Lesson = require('./models/Lesson');
const Progresses = require('./models/Progress');
const database = require('./config/database');

// Sample data
const sampleUsers = [
  {
    name: 'Administrator',
    username: 'admin',
    email: 'admin@nextgen.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'icon:{"iconName":"FaCat","color":"#FF6B6B","name":"Mèo"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 30,
      level: 'advanced',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    },
    subscription: {
      type: 'vip',
      isActive: true
    }
  },
  {
    name: 'Emma Student',
    username: 'emma',
    email: 'emma@student.com',
    password: 'student123',
    role: 'student',
    avatar: 'icon:{"iconName":"FaDog","color":"#4ECDC4","name":"Chó"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 12,
      level: 'beginner',
      interests: ['games', 'music', 'cartoons'],
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'vi'
    },
    stats: {
      totalLessonsCompleted: 15,
      totalTimeSpent: 450,
      currentStreak: 5,
      longestStreak: 12
    },
    subscription: {
      type: 'premium',
      startDate: new Date('2024-01-15'),
      endDate: new Date('2025-01-15'),
      isActive: true
    }
  },
  {
    name: 'John Teacher',
    username: 'johnteacher',
    email: 'john@teacher.com',
    password: 'teacher123',
    role: 'teacher',
    avatar: 'icon:{"iconName":"FaDragon","color":"#BB8FCE","name":"Rồng"}',
    isActive: true,
    emailVerified: true,
    profile: {
      age: 28,
      level: 'advanced',
      timezone: 'Asia/Ho_Chi_Minh',
      language: 'en'
    },
    subscription: {
      type: 'vip',
      isActive: true
    }
  }
];

const sampleLessons = [
  {
    title: 'Học Bảng Chữ Cái A-Z',
    description: 'Bài học cơ bản về bảng chữ cái tiếng Anh dành cho trẻ em 6-8 tuổi. Học qua bài hát vui nhộn và trò chơi tương tác.',
    slug: 'hoc-bang-chu-cai-a-z',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/alphabet-song.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20alphabet%20letters%20A%20to%20Z%20cartoon%20educational&width=400&height=300&seq=lesson1&orientation=landscape',
    ageGroup: '6-8',
    duration: 15, // 15 minutes
    price: 0, // Free
    currency: 'VND',
    minigameUrl: 'https://kahoot.it/challenge/abc-learning-game',
    status: 'published',
    category: 'vocabulary',
    level: 'beginner',
    objectives: [
      'Nhận biết 26 chữ cái tiếng Anh',
      'Phát âm đúng từng chữ cái',
      'Ghi nhớ thứ tự bảng chữ cái',
      'Viết được các chữ cái cơ bản'
    ],
    prerequisites: [
      'Không cần kiến thức tiền đề'
    ],
    tags: ['alphabet', 'beginner', 'kids', 'vocabulary', 'pronunciation'],
    stats: {
      totalViews: 245,
      totalPurchases: 150,
      totalCompletions: 89,
      averageRating: 4.8,
      totalReviews: 45
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-01')
  },
  {
    title: 'Đếm Số 1-10 Bằng Tiếng Anh',
    description: 'Học cách đếm số từ 1 đến 10 bằng tiếng Anh qua bài hát và trò chơi. Phù hợp cho trẻ em 6-8 tuổi.',
    slug: 'dem-so-1-10-bang-tieng-anh',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/counting-1-10.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20numbers%201%20to%2010%20cartoon%20children%20counting&width=400&height=300&seq=lesson2&orientation=landscape',
    ageGroup: '6-8',
    duration: 12, // 12 minutes
    price: 50000, // 50,000 VND
    currency: 'VND',
    minigameUrl: 'https://quizizz.com/join/quiz/number-counting-game',
    status: 'published',
    category: 'vocabulary',
    level: 'beginner',
    objectives: [
      'Đếm từ 1 đến 10 bằng tiếng Anh',
      'Nhận biết số viết và số nói',
      'Sử dụng số trong câu đơn giản',
      'Phát âm chuẩn các con số'
    ],
    prerequisites: [
      'Đã học bảng chữ cái cơ bản'
    ],
    tags: ['numbers', 'counting', 'beginner', 'kids', 'math'],
    stats: {
      totalViews: 189,
      totalPurchases: 95,
      totalCompletions: 67,
      averageRating: 4.6,
      totalReviews: 28
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: new Date('2024-01-15')
  },
  {
    title: 'Màu Sắc Trong Tiếng Anh',
    description: 'Học tên các màu sắc cơ bản bằng tiếng Anh. Bài học sinh động với hình ảnh và hoạt động tô màu.',
    slug: 'mau-sac-trong-tieng-anh',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/colors-lesson.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20rainbow%20colors%20cartoon%20children%20learning&width=400&height=300&seq=lesson3&orientation=landscape',
    ageGroup: '6-8',
    duration: 18, // 18 minutes
    price: 75000, // 75,000 VND
    currency: 'VND',
    minigameUrl: 'https://blooket.com/play/colors-matching-game',
    status: 'published',
    category: 'vocabulary',
    level: 'beginner',
    objectives: [
      'Học tên 10 màu sắc cơ bản',
      'Mô tả màu sắc của đồ vật',
      'Sử dụng màu sắc trong câu',
      'Phân biệt các sắc thái màu'
    ],
    prerequisites: [
      'Đã học bảng chữ cái và số đếm cơ bản'
    ],
    tags: ['colors', 'vocabulary', 'beginner', 'kids', 'visual'],
    stats: {
      totalViews: 156,
      totalPurchases: 78,
      totalCompletions: 52,
      averageRating: 4.7,
      totalReviews: 22
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: new Date('2024-02-01')
  },
  {
    title: 'Động Vật Quen Thuộc',
    description: 'Học tên các con vật quen thuộc bằng tiếng Anh. Dành cho trẻ 8-10 tuổi với từ vựng phong phú hơn.',
    slug: 'dong-vat-quen-thuoc',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/animals-lesson.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20animals%20farm%20zoo%20children%20learning&width=400&height=300&seq=lesson4&orientation=landscape',
    ageGroup: '8-10',
    duration: 25, // 25 minutes
    price: 100000, // 100,000 VND
    currency: 'VND',
    minigameUrl: 'https://gimkit.com/join/animal-sounds-quiz',
    status: 'published',
    category: 'vocabulary',
    level: 'elementary',
    objectives: [
      'Học tên 20 con vật phổ biến',
      'Mô tả đặc điểm của động vật',
      'Phân biệt động vật hoang dã và nuôi',
      'Sử dụng động từ liên quan đến động vật'
    ],
    prerequisites: [
      'Đã có kiến thức từ vựng cơ bản',
      'Biết màu sắc và số đếm'
    ],
    tags: ['animals', 'vocabulary', 'elementary', 'nature', 'kids'],
    stats: {
      totalViews: 134,
      totalPurchases: 62,
      totalCompletions: 41,
      averageRating: 4.9,
      totalReviews: 18
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: new Date('2024-02-15')
  },
  {
    title: 'Giao Tiếp Cơ Bản - Chào Hỏi',
    description: 'Học cách chào hỏi và giới thiệu bản thân bằng tiếng Anh. Bài học tương tác cho trẻ 8-10 tuổi.',
    slug: 'giao-tiep-co-ban-chao-hoi',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/greetings-lesson.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=children%20greeting%20hello%20handshake%20cartoon%20friendly&width=400&height=300&seq=lesson5&orientation=landscape',
    ageGroup: '8-10',
    duration: 20, // 20 minutes
    price: 0, // Free
    currency: 'VND',
    minigameUrl: 'https://kahoot.it/challenge/greetings-conversation',
    status: 'published',
    category: 'speaking',
    level: 'elementary',
    objectives: [
      'Chào hỏi lịch sự bằng tiếng Anh',
      'Giới thiệu tên và tuổi',
      'Hỏi thăm sức khỏe cơ bản',
      'Tạm biệt một cách tự nhiên'
    ],
    prerequisites: [
      'Có từ vựng cơ bản về số và tên'
    ],
    tags: ['speaking', 'conversation', 'greetings', 'social', 'elementary'],
    stats: {
      totalViews: 298,
      totalPurchases: 180,
      totalCompletions: 125,
      averageRating: 4.5,
      totalReviews: 67
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: new Date('2024-03-01')
  },
  {
    title: 'Gia Đình Tôi - My Family',
    description: 'Học từ vựng về thành viên gia đình và cách giới thiệu gia đình bằng tiếng Anh.',
    slug: 'gia-dinh-toi-my-family',
    // createdBy will be set to John Teacher's ID
    videoUrl: 'https://example.com/videos/family-lesson.mp4',
    thumbnail: 'https://readdy.ai/api/search-image?query=happy%20family%20cartoon%20parents%20children%20together&width=400&height=300&seq=lesson6&orientation=landscape',
    ageGroup: '8-10',
    duration: 22, // 22 minutes
    price: 80000, // 80,000 VND
    currency: 'VND',
    minigameUrl: '',  // Không có minigame
    status: 'draft', // Đang soạn thảo
    category: 'vocabulary',
    level: 'elementary',
    objectives: [
      'Học tên các thành viên gia đình',
      'Mô tả gia đình của mình',
      'Sử dụng đại từ sở hữu',
      'Kể về hoạt động gia đình'
    ],
    prerequisites: [
      'Đã biết cách chào hỏi và giới thiệu bản thân'
    ],
    tags: ['family', 'vocabulary', 'relationships', 'elementary', 'personal'],
    stats: {
      totalViews: 0,
      totalPurchases: 0,
      totalCompletions: 0,
      averageRating: 0,
      totalReviews: 0
    },
    settings: {
      allowComments: true,
      allowRating: true,
      isActive: true
    },
    publishedAt: null // Chưa xuất bản
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to database
    await database.connect();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Lesson.deleteMany({});
    await Progresses.deleteMany({});

    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Get teacher for lesson creation
    const johnTeacher = createdUsers.find(user => user.username === 'johnteacher');
    
    if (!johnTeacher) {
      throw new Error('John Teacher not found in created users');
    }

    // Add createdBy to lessons
    const lessonsWithCreator = sampleLessons.map(lesson => ({
      ...lesson,
      createdBy: johnTeacher._id
    }));

    // Seed lessons
    console.log('📚 Seeding lessons...');
    const createdLessons = await Lesson.create(lessonsWithCreator);
    console.log(`✅ Created ${createdLessons.length} lessons`);

    // Create sample progress for Emma
    console.log('📈 Creating sample lesson progress...');
    const emma = createdUsers.find(user => user.username === 'emma');
    const alphabetLesson = createdLessons.find(lesson => lesson.slug === 'hoc-bang-chu-cai-a-z');
    const numbersLesson = createdLessons.find(lesson => lesson.slug === 'dem-so-1-10-bang-tieng-anh');
    const greetingsLesson = createdLessons.find(lesson => lesson.slug === 'giao-tiep-co-ban-chao-hoi');
    
    if (emma && alphabetLesson) {
      // Emma completed alphabet lesson
      const alphabetProgress = new Progresses({
        userId: emma._id,
        lessonId: alphabetLesson._id,
        status: 'completed',
        enrolledAt: new Date('2024-12-01'),
        startedAt: new Date('2024-12-01'),
        completedAt: new Date('2024-12-02'),
        watchTime: 900, // 15 minutes (full video)
        totalTime: 900,
        progressPercentage: 100,
        bestScore: 85,
        rating: {
          score: 5,
          review: 'Bài học rất hay và dễ hiểu cho bé!',
          ratedAt: new Date('2024-12-02')
        },
        paymentInfo: {
          paid: true,
          paidAt: new Date('2024-12-01'),
          amount: 0,
          paymentMethod: 'free'
        }
      });
      
      await alphabetProgress.save();
      console.log('✅ Created alphabet lesson progress');
    }

    if (emma && numbersLesson) {
      // Emma is in progress with numbers lesson (paid)
      const numbersProgress = new Progresses({
        userId: emma._id,
        lessonId: numbersLesson._id,
        status: 'in-progress',
        enrolledAt: new Date('2024-12-03'),
        startedAt: new Date('2024-12-03'),
        watchTime: 360, // 6 minutes out of 12
        totalTime: 720, // 12 minutes
        progressPercentage: 50,
        paymentInfo: {
          paid: true,
          paidAt: new Date('2024-12-03'),
          amount: 50000,
          paymentMethod: 'card',
          transactionId: 'TXN_12345678'
        }
      });
      
      await numbersProgress.save();
      console.log('✅ Created numbers lesson progress');
    }

    if (emma && greetingsLesson) {
      // Emma enrolled but not started greetings lesson
      const greetingsProgress = new Progresses({
        userId: emma._id,
        lessonId: greetingsLesson._id,
        status: 'not-started',
        enrolledAt: new Date('2024-12-05'),
        watchTime: 0,
        totalTime: 1200, // 20 minutes
        progressPercentage: 0,
        paymentInfo: {
          paid: true,
          paidAt: new Date('2024-12-05'),
          amount: 0,
          paymentMethod: 'free'
        }
      });
      
      await greetingsProgress.save();
      console.log('✅ Created greetings lesson progress');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Lessons: ${createdLessons.length}`);
    console.log('Lesson Progress: 3 sample records');
    console.log('\n🔐 Test accounts:');
    console.log('Admin: admin@nextgen.com / admin123');
    console.log('Student: emma@student.com / student123');
    console.log('Teacher: john@teacher.com / teacher123');
    console.log('\n📚 Sample lessons:');
    console.log('- Học Bảng Chữ Cái A-Z (Free, Published)');
    console.log('- Đếm Số 1-10 (50k VND, Published)');
    console.log('- Màu Sắc Trong Tiếng Anh (75k VND, Published)');
    console.log('- Động Vật Quen Thuộc (100k VND, Published)');
    console.log('- Giao Tiếp Cơ Bản (Free, Published)');
    console.log('- Gia Đình Tôi (80k VND, Draft)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    process.exit(0);
  }
}

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleUsers, sampleLessons };
