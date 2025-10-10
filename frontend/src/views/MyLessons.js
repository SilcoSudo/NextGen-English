import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyLessons() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Transform database lesson object to safe display format
  const transformLesson = (lesson) => {
    if (!lesson || typeof lesson !== 'object') {
      return null;
    }

    return {
      _id: lesson._id,
      id: lesson.id || lesson._id,
      title: String(lesson.title || 'Untitled Lesson'),
      description: String(lesson.description || 'No description'),
      level: String(lesson.level || 'Beginner'),
      ageGroup: String(lesson.ageGroup || 'all'),
      
      // Transform duration from various possible formats
      duration: lesson.video?.duration || lesson.duration || 0,
      
      // Safe thumbnail handling  
      thumbnail: lesson.thumbnail || lesson.video?.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80',
      
      // Teacher info
      teacherName: (() => {
        if (lesson.createdBy && typeof lesson.createdBy === 'object') {
          return String(lesson.createdBy.name || 'Unknown Teacher');
        }
        return String(lesson.teacherName || 'Unknown Teacher');
      })(),
      
      // Pricing info
      price: (() => {
        if (lesson.pricing && typeof lesson.pricing === 'object') {
          const price = lesson.pricing.discountPrice || lesson.pricing.price;
          return price ? `${price.toLocaleString('vi-VN')}đ` : 'Free';
        }
        return 'Free';
      })(),

      // Progress info - this would come from LessonProgress model
      progress: lesson.progress || 0,
      status: lesson.status || 'purchased', // purchased, watching, completed
      lastWatchedAt: lesson.lastWatchedAt || null,
      completedAt: lesson.completedAt || null,
      watchTime: lesson.watchTime || 0
    };
  };

  // Fetch user's purchased lessons
  useEffect(() => {
    const fetchPurchasedLessons = async () => {
      try {
        const token = localStorage.getItem('authToken');
        console.log('Token for purchased lessons:', token ? 'Present' : 'Missing');
        
        if (!token) {
          console.error('No authentication token found');
          setError('Vui lòng đăng nhập để truy cập trang này.');
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '#/login';
          }, 1500);
          setLoading(false);
          return;
        }
        
        console.log('Making request to:', `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons/my-lessons`);
        
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons/my-lessons`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        console.log('📨 Response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log('📚 My lessons response:', data);
          
          // Handle different response formats
          let rawLessons = [];
          if (Array.isArray(data)) {
            rawLessons = data;
          } else if (data.data && Array.isArray(data.data)) {
            rawLessons = data.data;
          } else if (data.lessons && Array.isArray(data.lessons)) {
            rawLessons = data.lessons;
          } else {
            console.warn('⚠️ Unexpected response format:', data);
            rawLessons = [];
          }
          
          // Transform each lesson to safe format
          const transformedLessons = rawLessons
            .map(transformLesson)
            .filter(lesson => lesson !== null);
          
          console.log('📚 Transformed lessons:', transformedLessons);
          setLessons(transformedLessons);
        } else {
          console.error('❌ Failed to fetch purchased lessons:', response.status);
          
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            setTimeout(() => {
              localStorage.removeItem('authToken');
              window.location.href = '#/login';
            }, 2000);
          } else if (response.status === 403) {
            setError('Bạn không có quyền truy cập trang này hoặc chưa mua bài học nào.');
          } else {
            setError(errorData.message || 'Không thể tải danh sách bài học đã mua');
          }
        }
      } catch (error) {
        console.error('Error fetching purchased lessons:', error);
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedLessons();
  }, []);

  const getProgressWidth = (progress) => {
    return Math.min(Math.max(progress || 0, 0), 100);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">✅ Hoàn thành</span>;
      case 'watching':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">▶️ Đang xem</span>;
      case 'purchased':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">🛒 Đã mua</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">⏳ Chưa bắt đầu</span>;
    }
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài học...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bài Học Của Tôi
            </h1>
            <p className="text-gray-600 mt-2">Quản lý và tiếp tục học các bài học đã mua</p>
          </div>
          <button
            onClick={() => navigate('/lessons')}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <span>🔍</span>
            <span>Khám phá thêm</span>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 shadow-sm">
            <div className="flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-blue-600 mb-2">{lessons.length}</div>
            <div className="text-gray-600 font-medium text-sm">Bài học đã mua</div>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-green-600 mb-2">
              {lessons.filter(l => l.status === 'completed').length}
            </div>
            <div className="text-gray-600 font-medium text-sm">Đã hoàn thành</div>
          </div>
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20 shadow-lg">
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {lessons.filter(l => l.status === 'watching').length}
            </div>
            <div className="text-gray-600 font-medium text-sm">Đang học</div>
          </div>
        </div>

        {!Array.isArray(lessons) || lessons.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-12 shadow-lg border border-white/20 max-w-md mx-auto">
              <div className="text-6xl mb-6">📚</div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">Chưa có bài học nào</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Hãy khám phá và mua các bài học tiếng Anh chất lượng cao để bắt đầu hành trình học tập của bạn!
              </p>
              <button
                onClick={() => navigate('/lessons')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center space-x-2">
                  <span>🚀</span>
                  <span>Khám phá bài học ngay</span>
                </span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.isArray(lessons) && lessons.map((lesson) => {
              console.log('  Rendering lesson:', lesson.title);
              if (!lesson || typeof lesson !== 'object') {
                console.error('❌ Invalid lesson object:', lesson);
                return null;
              }
              
              return (
                <div key={lesson._id || lesson.id || Math.random()} className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/20 transform hover:-translate-y-2">
                  <div className="relative">
                    <img 
                      src={lesson.thumbnail} 
                      alt={lesson.title} 
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    
                    {/* Progress overlay */}
                    {lesson.progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur-sm">
                        <div className="px-4 py-2">
                          <div className="flex items-center justify-between text-white text-sm mb-1">
                            <span>Tiến độ</span>
                            <span>{Math.round(lesson.progress)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${getProgressWidth(lesson.progress)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Duration badge */}
                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                      {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    {/* Status and Level */}
                    <div className="flex items-center justify-between mb-4">
                      {getStatusBadge(lesson.status)}
                      <div className="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 rounded-full text-xs font-medium">
                        {lesson.level}
                      </div>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {lesson.title}
                    </h2>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{lesson.description}</p>
                    
                    {/* Teacher and Time info */}
                    <div className="flex items-center justify-between mb-6 text-sm text-gray-500">
                      <span>👨‍🏫 {lesson.teacherName}</span>
                      <span>🎯 {lesson.ageGroup} tuổi</span>
                    </div>

                    {/* Last watched info */}
                    {lesson.lastWatchedAt && (
                      <div className="text-xs text-gray-500 mb-4 flex items-center space-x-1">
                        <span>🕒</span>
                        <span>Xem lần cuối: {new Date(lesson.lastWatchedAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg text-sm"
                        onClick={() => navigate(`/lessons/${lesson._id || lesson.id}/watch`)}
                      >
                        <span className="flex items-center justify-center space-x-2">
                          <span>{lesson.status === 'completed' ? '🔄' : '▶️'}</span>
                          <span>{lesson.status === 'completed' ? 'Xem lại' : 'Tiếp tục'}</span>
                        </span>
                      </button>
                      
                      {lesson.status === 'completed' && (
                        <button
                          className="px-4 py-3 bg-gradient-to-r from-green-100 to-green-200 hover:from-green-200 hover:to-green-300 text-green-700 rounded-xl font-medium transition-all duration-300 text-sm"
                          title="Đánh giá bài học"
                        >
                          ⭐
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }).filter(Boolean)}
          </div>
        )}
      </div>
    </main>
  );
}

export default MyLessons;