// Dữ liệu chung cho admin dashboard
export const adminStats = {
  totalStudents: 2847,
  activeCourses: 5,
  monthlyRevenue: 20000000, // 20 triệu VND
  completionRate: 87,
  studentChange: '+12%',
  courseChange: '+1',
  revenueChange: '+18%',
  completionChange: '+5%'
};

export const courseData = [
  {
    id: 1,
    title: 'Speaking: Greetings & Introductions',
    students: 1250,
    progress: 85,
    revenue: 374750000, // 1250 * 299000
    category: 'Speaking',
    level: 'Cơ bản',
    age: '4-7 tuổi',
    skills: ['Nói'],
    weeks: 2,
    lessons: 8,
    price: 299000,
    originalPrice: 399000,
    status: 'active',
    rating: 4.8,
    duration: '2 hours',
    image: 'https://readdy.ai/api/search-image?query=classroom%20with%20children%20and%20whiteboard%20displaying%20English%20words%2C%20cartoon%20illustration&width=300&height=200&seq=speaking&orientation=landscape',
    teacherName: 'Sarah Johnson',
    teacherRole: 'Giáo viên chính',
    teacherAvatar: 'https://readdy.ai/api/search-image?query=professional%20female%20teacher%20portrait&width=32&height=32&seq=teacher1&orientation=squarish',
    label: 'Phổ biến',
    labelColor: 'bg-yellow-400 text-white',
    levelColor: 'bg-blue-100 text-blue-700',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    title: 'Listening: Daily Conversations',
    students: 890,
    progress: 65,
    revenue: 221610000, // 890 * 249000
    category: 'Listening',
    level: 'Trung cấp',
    age: '8-10 tuổi',
    skills: ['Nghe'],
    weeks: 1.5,
    lessons: 6,
    price: 249000,
    originalPrice: 349000,
    status: 'active',
    rating: 4.6,
    duration: '1.5 hours',
    image: 'https://readdy.ai/api/search-image?query=children%20with%20headphones%20and%20microphone%2C%20cartoon%20illustration&width=300&height=200&seq=listening&orientation=landscape',
    teacherName: 'Mike Chen',
    teacherRole: 'Giáo viên chính',
    teacherAvatar: 'https://readdy.ai/api/search-image?query=professional%20male%20teacher%20portrait&width=32&height=32&seq=teacher2&orientation=squarish',
    label: 'Mới',
    labelColor: 'bg-green-500 text-white',
    levelColor: 'bg-purple-100 text-purple-700',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    title: 'Reading: Short Stories',
    students: 0,
    progress: 0,
    revenue: 0,
    category: 'Reading',
    level: 'Cơ bản',
    age: '4-7 tuổi',
    skills: ['Đọc'],
    weeks: 1,
    lessons: 5,
    price: 199000,
    originalPrice: 299000,
    status: 'draft',
    rating: 0,
    duration: '1 hour',
    image: 'https://readdy.ai/api/search-image?query=children%20reading%20book%20in%20library%2C%20cartoon%20illustration&width=300&height=200&seq=reading&orientation=landscape',
    teacherName: 'Emma Wilson',
    teacherRole: 'Giáo viên chính',
    teacherAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    label: 'Mới',
    labelColor: 'bg-green-500 text-white',
    levelColor: 'bg-blue-100 text-blue-700',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: 4,
    title: 'Writing: Basic Sentences',
    students: 650,
    progress: 58,
    revenue: 116350000, // 650 * 179000
    category: 'Writing',
    level: 'Cơ bản',
    age: '4-7 tuổi',
    skills: ['Viết'],
    weeks: 1.8,
    lessons: 7,
    price: 179000,
    originalPrice: 279000,
    status: 'active',
    rating: 4.7,
    duration: '1.8 hours',
    image: 'https://readdy.ai/api/search-image?query=writing%20notebook%20with%20pencil%2C%20cartoon%20illustration&width=300&height=200&seq=writing&orientation=landscape',
    teacherName: 'David Brown',
    teacherRole: 'Giáo viên chính',
    teacherAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    label: 'Hot',
    labelColor: 'bg-red-500 text-white',
    levelColor: 'bg-blue-100 text-blue-700',
    createdAt: '2024-01-12',
    updatedAt: '2024-01-19'
  },
  {
    id: 5,
    title: 'Grammar: Present Tense',
    students: 1100,
    progress: 72,
    revenue: 251900000, // 1100 * 229000
    category: 'Grammar',
    level: 'Trung cấp',
    age: '8-10 tuổi',
    skills: ['Ngữ pháp'],
    weeks: 2.5,
    lessons: 10,
    price: 229000,
    originalPrice: 329000,
    status: 'active',
    rating: 4.9,
    duration: '2.5 hours',
    image: 'https://readdy.ai/api/search-image?query=grammar%20book%20with%20examples%2C%20cartoon%20illustration&width=300&height=200&seq=grammar&orientation=landscape',
    teacherName: 'Lisa Park',
    teacherRole: 'Giáo viên chính',
    teacherAvatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    label: 'Phổ biến',
    labelColor: 'bg-yellow-400 text-white',
    levelColor: 'bg-purple-100 text-purple-700',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-17'
  }
];

export const recentActivities = [
  { user: 'Emma Wilson', action: 'đã hoàn thành', target: 'Speaking: Greetings & Introductions', time: '5 phút trước', avatar: 'E' },
  { user: 'John Smith', action: 'đăng ký', target: 'Grammar: Present Tense', time: '15 phút trước', avatar: 'J' },
  { user: 'Sarah Johnson', action: 'bắt đầu', target: 'Listening: Daily Conversations', time: '30 phút trước', avatar: 'S' },
  { user: 'Mike Chen', action: 'đạt điểm cao', target: 'Writing: Basic Sentences', time: '1 giờ trước', avatar: 'M' },
  { user: 'David Brown', action: 'hoàn thành', target: 'Reading: Short Stories', time: '2 giờ trước', avatar: 'D' },
];

export const revenueData = {
  monthly: [
    { month: 'T1', revenue: 15000000 },
    { month: 'T2', revenue: 18000000 },
    { month: 'T3', revenue: 16000000 },
    { month: 'T4', revenue: 19000000 },
    { month: 'T5', revenue: 17000000 },
    { month: 'T6', revenue: 20000000 },
  ],
  byCategory: [
    { category: 'Speaking', revenue: 374750000, percentage: 38.5 },
    { category: 'Grammar', revenue: 251900000, percentage: 25.9 },
    { category: 'Listening', revenue: 221610000, percentage: 22.8 },
    { category: 'Writing', revenue: 116350000, percentage: 12.0 },
    { category: 'Reading', revenue: 0, percentage: 0.8 },
  ],
  topCourses: [
    { name: 'Speaking: Greetings & Introductions', revenue: 374750000, students: 1250 },
    { name: 'Grammar: Present Tense', revenue: 251900000, students: 1100 },
    { name: 'Listening: Daily Conversations', revenue: 221610000, students: 890 },
    { name: 'Writing: Basic Sentences', revenue: 116350000, students: 650 },
  ]
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat('vi-VN').format(num);
}; 