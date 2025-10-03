const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/UserMongoDB');
const Course = require('./models/Course');
const Progress = require('./models/Progress');
const database = require('./config/database');

// Sample data
const sampleUsers = [
  {
    name: 'Administrator',
    username: 'admin',
    email: 'admin@nextgen.com',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20admin%20avatar%20cartoon%20style%20business%20person%20with%20tie%2C%20friendly%20smile%2C%20digital%20art&width=60&height=60&seq=admin&orientation=squarish',
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
    avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=60&height=60&seq=student&orientation=squarish',
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
    avatar: 'https://readdy.ai/api/search-image?query=professional%20teacher%20avatar%20cartoon%20style%20friendly%20educator%20with%20glasses&width=60&height=60&seq=teacher&orientation=squarish',
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

const sampleCourses = [
  {
    title: 'English for Kids - Beginner',
    description: 'Khóa học tiếng Anh cơ bản dành cho trẻ em từ 4-8 tuổi. Học qua trò chơi, bài hát và hoạt động tương tác thú vị.',
    slug: 'english-for-kids-beginner',
    thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20cartoon%20children%20learning%20English%20alphabet%20books%20educational%20setting&width=400&height=300&seq=course1&orientation=landscape',
    category: 'kids',
    level: 'beginner',
    ageGroup: 'kids',
    instructor: {
      name: 'Ms. Sarah',
      bio: 'Giáo viên tiếng Anh chuyên nghiệp với 8 năm kinh nghiệm giảng dạy trẻ em',
      avatar: 'https://readdy.ai/api/search-image?query=friendly%20female%20teacher%20avatar%20cartoon%20style&width=60&height=60&seq=teacher1&orientation=squarish',
      credentials: ['TESOL Certificate', 'Cambridge CELTA', '8 years experience']
    },
    pricing: {
      type: 'free',
      price: 0,
      currency: 'VND'
    },
    lessons: [
      {
        title: 'Alphabet Song - A to Z',
        description: 'Học bảng chữ cái tiếng Anh qua bài hát vui nhộn',
        thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20alphabet%20letters%20singing%20cartoon%20style&width=300&height=200&seq=lesson1&orientation=landscape',
        content: [
          {
            type: 'video',
            title: 'Alphabet Song Video',
            content: {
              url: 'https://example.com/alphabet-song.mp4',
              data: { subtitles: true, interactive: true }
            },
            duration: 180,
            order: 1
          },
          {
            type: 'exercise',
            title: 'Match the Letters',
            content: {
              data: {
                type: 'matching',
                pairs: [
                  { letter: 'A', image: 'apple.jpg' },
                  { letter: 'B', image: 'ball.jpg' }
                ]
              }
            },
            duration: 300,
            order: 2
          }
        ],
        skills: ['vocabulary', 'pronunciation'],
        level: 'beginner',
        estimatedDuration: 15,
        order: 1,
        isActive: true,
        isPremium: false,
        objectives: [
          'Nhận biết 26 chữ cái tiếng Anh',
          'Phát âm đúng từng chữ cái',
          'Ghi nhớ thứ tự bảng chữ cái'
        ],
        quiz: {
          questions: [
            {
              question: 'Chữ cái nào đứng sau A?',
              type: 'multiple-choice',
              options: ['B', 'C', 'D', 'E'],
              correctAnswer: 'B',
              explanation: 'Trong bảng chữ cái, B đứng ngay sau A',
              points: 1
            }
          ],
          passingScore: 70,
          timeLimit: 10
        }
      },
      {
        title: 'Numbers 1-10',
        description: 'Học đếm số từ 1 đến 10 bằng tiếng Anh',
        thumbnail: 'https://readdy.ai/api/search-image?query=colorful%20numbers%201%20to%2010%20cartoon%20educational&width=300&height=200&seq=lesson2&orientation=landscape',
        content: [
          {
            type: 'video',
            title: 'Counting Song 1-10',
            content: {
              url: 'https://example.com/counting-song.mp4'
            },
            duration: 240,
            order: 1
          },
          {
            type: 'game',
            title: 'Number Matching Game',
            content: {
              data: {
                type: 'number-match',
                range: [1, 10]
              }
            },
            duration: 360,
            order: 2
          }
        ],
        skills: ['vocabulary', 'listening'],
        level: 'beginner',
        estimatedDuration: 12,
        order: 2,
        isActive: true,
        isPremium: false,
        objectives: [
          'Đếm từ 1 đến 10 bằng tiếng Anh',
          'Nhận biết số viết và số nói',
          'Sử dụng số trong câu đơn giản'
        ],
        prerequisites: [
          {
            title: 'Alphabet Song - A to Z'
          }
        ]
      }
    ],
    stats: {
      totalEnrollments: 150,
      totalCompletions: 89,
      averageRating: 4.8,
      totalReviews: 45,
      totalDuration: 27
    },
    settings: {
      isActive: true,
      isPublished: true,
      allowComments: true,
      allowRating: true
    },
    tags: ['kids', 'beginner', 'alphabet', 'numbers', 'basic'],
    keywords: ['tiếng anh trẻ em', 'học bảng chữ cái', 'đếm số tiếng anh'],
    requirements: [
      'Không cần kiến thức tiền đề',
      'Độ tuổi từ 4-8 tuổi',
      'Có thiết bị nghe âm thanh'
    ],
    whatYouWillLearn: [
      'Nắm vững 26 chữ cái tiếng Anh',
      'Đếm số từ 1-10 thành thạo',
      'Phát âm chuẩn các từ cơ bản',
      'Tự tin giao tiếp đơn giản'
    ],
    publishedAt: new Date('2024-01-01')
  },
  {
    title: 'Business English Essentials',
    description: 'Khóa học tiếng Anh thương mại cần thiết cho môi trường công sở. Tập trung vào kỹ năng giao tiếp, email và thuyết trình.',
    slug: 'business-english-essentials',
    thumbnail: 'https://readdy.ai/api/search-image?query=professional%20business%20meeting%20presentation%20office%20setting&width=400&height=300&seq=course2&orientation=landscape',
    category: 'business',
    level: 'intermediate',
    ageGroup: 'adults',
    instructor: {
      name: 'Mr. David Wilson',
      bio: 'Chuyên gia tiếng Anh thương mại với 12 năm kinh nghiệm đào tạo doanh nghiệp',
      avatar: 'https://readdy.ai/api/search-image?query=professional%20business%20trainer%20male%20suit%20avatar&width=60&height=60&seq=teacher2&orientation=squarish',
      credentials: ['MBA Business Administration', 'TESOL Business English', '12+ years corporate training']
    },
    pricing: {
      type: 'premium',
      price: 1500000,
      currency: 'VND',
      discountPrice: 1200000
    },
    lessons: [
      {
        title: 'Professional Email Writing',
        description: 'Học cách viết email chuyên nghiệp trong môi trường công sở',
        thumbnail: 'https://readdy.ai/api/search-image?query=professional%20email%20writing%20laptop%20office&width=300&height=200&seq=lesson3&orientation=landscape',
        content: [
          {
            type: 'text',
            title: 'Email Structure and Format',
            content: {
              text: '<h3>Professional Email Structure</h3><p>A professional email should include...</p>'
            },
            duration: 900,
            order: 1
          },
          {
            type: 'exercise',
            title: 'Email Writing Practice',
            content: {
              data: {
                type: 'writing',
                prompt: 'Write a professional email to request a meeting with your supervisor'
              }
            },
            duration: 1200,
            order: 2
          }
        ],
        skills: ['writing', 'vocabulary'],
        level: 'intermediate',
        estimatedDuration: 35,
        order: 1,
        isActive: true,
        isPremium: true,
        objectives: [
          'Viết email chuyên nghiệp',
          'Sử dụng ngôn ngữ trang trọng',
          'Cấu trúc email rõ ràng'
        ]
      }
    ],
    stats: {
      totalEnrollments: 75,
      totalCompletions: 42,
      averageRating: 4.6,
      totalReviews: 28,
      totalDuration: 35
    },
    settings: {
      isActive: true,
      isPublished: true,
      allowComments: true,
      allowRating: true
    },
    tags: ['business', 'intermediate', 'email', 'professional', 'workplace'],
    keywords: ['tiếng anh thương mại', 'email chuyên nghiệp', 'giao tiếp công sở'],
    requirements: [
      'Có kiến thức tiếng Anh cơ bản',
      'Đang làm việc hoặc chuẩn bị vào môi trường công sở',
      'Có nhu cầu sử dụng tiếng Anh trong công việc'
    ],
    whatYouWillLearn: [
      'Viết email chuyên nghiệp thành thạo',
      'Giao tiếp tự tin trong cuộc họp',
      'Thuyết trình hiệu quả bằng tiếng Anh',
      'Đàm phán và thảo luận công việc'
    ],
    publishedAt: new Date('2024-02-01')
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
    await Course.deleteMany({});
    await Progress.deleteMany({});

    // Seed users
    console.log('👥 Seeding users...');
    const createdUsers = await User.create(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);

    // Seed courses
    console.log('📚 Seeding courses...');
    const createdCourses = await Course.create(sampleCourses);
    console.log(`✅ Created ${createdCourses.length} courses`);

    // Create sample progress for Emma
    console.log('📈 Creating sample progress...');
    const emma = createdUsers.find(user => user.username === 'emma');
    const kidscourse = createdCourses.find(course => course.slug === 'english-for-kids-beginner');
    
    if (emma && kidscourse) {
      const progress = new Progress({
        userId: emma._id,
        courseId: kidscourse._id,
        status: 'in-progress',
        enrolledAt: new Date('2024-12-01'),
        startedAt: new Date('2024-12-01'),
        lessons: [
          {
            lessonId: kidscourse.lessons[0]._id,
            status: 'completed',
            completedAt: new Date('2024-12-02'),
            timeSpent: 900, // 15 minutes
            score: 85,
            attempts: 1
          },
          {
            lessonId: kidscourse.lessons[1]._id,
            status: 'in-progress',
            timeSpent: 360, // 6 minutes
            attempts: 1
          }
        ],
        rating: {
          score: 5,
          review: 'Khóa học rất bổ ích và thú vị cho bé!',
          ratedAt: new Date('2024-12-10')
        }
      });
      
      await progress.save();
      console.log('✅ Created sample progress');
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Courses: ${createdCourses.length}`);
    console.log('\n🔐 Test accounts:');
    console.log('Admin: admin@nextgen.com / admin123');
    console.log('Student: emma@student.com / student123');
    console.log('Teacher: john@teacher.com / teacher123');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

// Run seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, sampleUsers, sampleCourses };