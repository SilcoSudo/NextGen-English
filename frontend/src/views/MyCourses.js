import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function MyCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Transform database course object to safe display format
  const transformCourse = (course) => {
    if (!course || typeof course !== 'object') {
      return null;
    }

    return {
      _id: course._id,
      id: course.id || course._id,
      title: String(course.title || 'Untitled Course'),
      description: String(course.description || 'No description'),
      level: String(course.level || 'Beginner'),
      ageGroup: String(course.ageGroup || 'all'),
      status: String(course.status || 'draft'),
      
      // Transform duration from various possible formats
      duration: (() => {
        if (course.duration) return String(course.duration);
        if (course.estimatedDuration) return String(course.estimatedDuration);
        return 'N/A';
      })(),
      
      // Safe thumbnail handling  
      thumbnail: course.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80',
      
      // Transform any object properties to safe strings
      instructor: (() => {
        if (typeof course.instructor === 'object' && course.instructor) {
          return String(course.instructor.name || 'Unknown Teacher');
        }
        return String(course.instructor || 'Unknown Teacher');
      })(),
      
      pricing: (() => {
        if (typeof course.pricing === 'object' && course.pricing) {
          return String(course.pricing.amount || 'Free');
        }
        return String(course.pricing || 'Free');
      })()
    };
  };

  // Fetch user's enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        // Use the correct localStorage key that AuthContext uses
        const token = localStorage.getItem('authToken');
        console.log('Token from localStorage (authToken):', token);
        console.log('Using token for request:', token ? 'Present' : 'Missing');
        
        // If no token, redirect to login immediately
        if (!token) {
          console.error('No authentication token found');
          console.log('Checking all localStorage keys:', Object.keys(localStorage));
          setError('Vui lòng đăng nhập để truy cập trang này.');
          setTimeout(() => {
            localStorage.clear();
            window.location.href = '#/login';
          }, 1500);
          setLoading(false);
          return;
        }
        
        // Debug token format
        console.log('Token length:', token.length);
        console.log('Token starts with:', token.substring(0, 20));
        
        // Check if token looks valid (JWT format)
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
          console.error('❌ Invalid token format');
          setError('Token không hợp lệ. Vui lòng đăng nhập lại.');
          localStorage.removeItem('authToken');
          setTimeout(() => {
            window.location.href = '#/login';
          }, 1500);
          setLoading(false);
          return;
        }
        
        console.log('Making request to:', 'http://localhost:5000/api/lessons/teacher/my-lessons');
        console.log('Authorization header:', `Bearer ${token.substring(0, 20)}...`);
        
        const response = await fetch('http://localhost:5000/api/lessons/teacher/my-lessons', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
        
        console.log('📨 Response status:', response.status);
        console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));

        if (response.ok) {
          const data = await response.json();
          console.log('📚 Teacher courses response:', data);
          
          // Handle different response formats
          let rawCourses = [];
          if (Array.isArray(data)) {
            rawCourses = data;
          } else if (data.data && Array.isArray(data.data)) {
            rawCourses = data.data;
          } else if (data.courses && Array.isArray(data.courses)) {
            rawCourses = data.courses;
          } else {
            console.warn('⚠️ Unexpected response format:', data);
            rawCourses = [];
          }
          
          // Transform each course to safe format
          const transformedCourses = rawCourses
            .map(transformCourse)
            .filter(course => course !== null);
          
          console.log('📚 Transformed courses:', transformedCourses);
          setCourses(transformedCourses);
        } else {
          console.error('❌ Failed to fetch teacher courses:', response.status);
          
          // Try fallback API for regular users
          if (response.status === 403) {
            console.log('🔄 Trying fallback: regular user courses');
            try {
              const fallbackResponse = await fetch('http://localhost:5000/api/lessons/my-lessons', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`,
                  'Content-Type': 'application/json',
                }
              });
              
              if (fallbackResponse.ok) {
                const fallbackData = await fallbackResponse.json();
                console.log('📚 Fallback courses response:', fallbackData);
                
                let rawCourses = fallbackData.data || fallbackData.courses || [];
                if (!Array.isArray(rawCourses)) {
                  rawCourses = [];
                }
                
                const transformedCourses = rawCourses
                  .map(transformCourse)
                  .filter(course => course !== null);
                
                setCourses(transformedCourses);
                return;
              }
            } catch (fallbackError) {
              console.error('❌ Fallback API also failed:', fallbackError);
            }
          }
          
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 401) {
            setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            setTimeout(() => {
              localStorage.removeItem('authToken');
              window.location.href = '#/login';
            }, 2000);
          } else if (response.status === 403) {
            setError('Bạn không có quyền truy cập trang này hoặc chưa có bài học nào.');
          } else {
            setError(errorData.message || 'Không thể tải danh sách bài học');
          }
        }
      } catch (error) {
        console.error('Error fetching teacher courses:', error);
        setError('Lỗi kết nối server');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

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
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Bài học đã mua</h1>
        <button
          onClick={() => navigate('/lessons')}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center space-x-2"
        >
          <span>🔍</span>
          <span>Khám phá bài học</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <p className="text-gray-600">
          Bài học đã mua ({Array.isArray(courses) ? courses.length : 0})
        </p>
      </div>

      {!Array.isArray(courses) || courses.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có bài học nào</h3>
          <p className="text-gray-600 mb-6">Hãy tạo bài học đầu tiên của bạn để bắt đầu giảng dạy!</p>
          <button
            onClick={() => navigate('/teacher?tab=create')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Tạo bài học ngay
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(courses) && courses.map((course) => {
            console.log('  Rendering course:', course);
            // Ensure course is an object with required properties
            if (!course || typeof course !== 'object') {
              console.error('❌ Invalid course object:', course);
              return null;
            }
            
            return (
              <div key={course._id || course.id || Math.random()} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow border">
                <img 
                  src={course.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80'} 
                  alt={course.title || 'Course'} 
                  className="w-full h-40 object-cover" 
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      course.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {course.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {course.ageGroup || 'N/A'} tuổi
                    </span>
                  </div>
                  
                  <h2 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{course.title || 'Untitled'}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description || 'No description'}</p>
                  
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                    <span>📚 {course.level || 'Unknown'}</span>
                    <span>⏱️ {course.duration || course.estimatedDuration || 'N/A'} phút</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors text-sm"
                      onClick={() => navigate(`/lessons/${course._id || course.id}/learn`)}
                    >
                      Xem bài học
                    </button>
                    <button
                      className="px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors text-sm"
                      onClick={() => {/* TODO: Edit course */}}
                    >
                      ✏️
                    </button>
                  </div>
                </div>
              </div>
            );
          }).filter(Boolean)}
        </div>
      )}
    </main>
  );
}

export default MyCourses; 