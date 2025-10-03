import React, { useState, useEffect } from 'react';
import { useAuth } from '../models/AuthContext';
import CreateLesson from '../components/CreateLesson';
import LessonManagement from '../components/LessonManagement';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch teacher's courses and statistics
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Fetch teacher's courses
      const coursesResponse = await fetch('http://localhost:5000/api/courses/teacher/my-courses', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.data || []);
        
        // Calculate statistics
        const totalCourses = coursesData.data?.length || 0;
        const publishedCourses = coursesData.data?.filter(c => c.status === 'published').length || 0;
        const draftCourses = coursesData.data?.filter(c => c.status === 'draft').length || 0;
        
        setStats({
          totalCourses,
          publishedCourses,
          draftCourses,
          totalStudents: 0 // TODO: implement when we have enrollment system
        });
      } else {
        setError('Không thể tải dữ liệu khóa học');
      }
    } catch (err) {
      console.error('Fetch teacher data error:', err);
      setError('Lỗi kết nối server');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonCreated = (newLesson) => {
    setCourses(prev => [newLesson, ...prev]);
    setStats(prev => ({
      ...prev,
      totalCourses: prev.totalCourses + 1,
      draftCourses: newLesson.status === 'draft' ? prev.draftCourses + 1 : prev.draftCourses,
      publishedCourses: newLesson.status === 'published' ? prev.publishedCourses + 1 : prev.publishedCourses
    }));
    setActiveTab('lessons');
  };

  const handleLessonUpdated = (updatedLesson) => {
    setCourses(prev => prev.map(course => 
      course._id === updatedLesson._id ? updatedLesson : course
    ));
    fetchTeacherData(); // Refresh stats
  };

  const handleLessonDeleted = (deletedLessonId) => {
    setCourses(prev => prev.filter(course => course._id !== deletedLessonId));
    fetchTeacherData(); // Refresh stats
  };

  const StatCard = ({ title, value, icon, color = 'blue' }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
        </div>
        <div className={`text-${color}-500 text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        px-6 py-3 font-medium rounded-lg transition-all duration-200
        ${active 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
        }
      `}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Giảng viên
              </h1>
              <p className="text-gray-600 mt-1">
                Chào mừng trở lại, {user?.name}!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Vai trò</p>
                <p className="font-medium text-blue-600 capitalize">{user?.role}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <TabButton
              id="overview"
              label="Tổng quan"
              active={activeTab === 'overview'}
              onClick={setActiveTab}
            />
            <TabButton
              id="lessons"
              label="Quản lý bài học"
              active={activeTab === 'lessons'}
              onClick={setActiveTab}
            />
            <TabButton
              id="create"
              label="Tạo bài học mới"
              active={activeTab === 'create'}
              onClick={setActiveTab}
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tổng số bài học"
                value={stats.totalCourses}
                icon="📚"
                color="blue"
              />
              <StatCard
                title="Đã xuất bản"
                value={stats.publishedCourses}
                icon="✅"
                color="green"
              />
              <StatCard
                title="Bản nháp"
                value={stats.draftCourses}
                icon="📝"
                color="yellow"
              />
              <StatCard
                title="Học viên"
                value={stats.totalStudents}
                icon="👥"
                color="purple"
              />
            </div>

            {/* Recent Courses */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Bài học gần đây
                </h2>
              </div>
              <div className="p-6">
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.slice(0, 5).map((course) => (
                      <div
                        key={course._id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {course.level} • {course.duration} phút
                          </p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span
                            className={`
                              px-2 py-1 text-xs font-medium rounded-full
                              ${course.status === 'published'
                                ? 'bg-green-100 text-green-800'
                                : course.status === 'draft'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                              }
                            `}
                          >
                            {course.status === 'published' ? 'Đã xuất bản' :
                             course.status === 'draft' ? 'Bản nháp' : course.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            {new Date(course.createdAt).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">📚</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Chưa có bài học nào
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Bắt đầu tạo bài học đầu tiên của bạn
                    </p>
                    <button
                      onClick={() => setActiveTab('create')}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Tạo bài học mới
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lessons' && (
          <LessonManagement
            courses={courses}
            onLessonUpdated={handleLessonUpdated}
            onLessonDeleted={handleLessonDeleted}
          />
        )}

        {activeTab === 'create' && (
          <CreateLesson
            onLessonCreated={handleLessonCreated}
            onCancel={() => setActiveTab('overview')}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherDashboard;