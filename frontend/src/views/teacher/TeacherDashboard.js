import React, { useState, useEffect } from 'react';
import { useAuth } from '../../models/AuthContext';
import { useSearchParams } from 'react-router-dom';
import CreateLesson from '../../components/CreateLesson';
import LessonManagement from '../../components/LessonManagement';
import VideoLibrary from '../../components/VideoLibrary';
import TeacherNotifications from '../../components/TeacherNotifications';
import TeacherSettings from '../../components/TeacherSettings';
import TeacherAnalytics from '../../components/TeacherAnalytics';
import TeacherHelp from '../../components/TeacherHelp';
import LearningAnalytics from '../../components/LearningAnalytics';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => {
    // Check URL params for initial tab
    const tabFromUrl = searchParams.get('tab');
    return ['overview', 'lessons', 'create', 'videos', 'analytics'].includes(tabFromUrl) 
      ? tabFromUrl 
      : 'overview';
  });
  const [courses, setCourses] = useState([]);
  const [stats, setStats] = useState({
    totalCourses: 0,
    publishedCourses: 0,
    draftCourses: 0,
    totalStudents: 0,
    totalViews: 0,
    totalVideos: 0,
    monthlyRevenue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Fetch teacher's courses and statistics
  useEffect(() => {
    fetchTeacherData();
  }, []);

  const fetchTeacherData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      
      // Fetch teacher's courses
      const coursesResponse = await fetch(`${window.location.origin}/api/lessons/teacher/my-lessons`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('📡 Courses response status:', coursesResponse.status);
      
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
        const errorData = await coursesResponse.json();
        console.log('❌ Courses fetch error:', errorData);
        setError(`Không thể tải dữ liệu khóa học: ${errorData.message || coursesResponse.status}`);
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
              {/* Notifications Button */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Thông báo"
              >
                <div className="text-xl">🔔</div>
                {/* Notification Badge */}
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </div>
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Cài đặt"
              >
                <div className="text-xl">⚙️</div>
              </button>

              <button
                onClick={() => setShowHelp(true)}
                className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                title="Trợ giúp"
              >
                <div className="text-xl">🆘</div>
              </button>
              
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
            <TabButton
              id="videos"
              label="Thư viện Video"
              active={activeTab === 'videos'}
              onClick={setActiveTab}
            />
            <TabButton
              id="analytics"
              label="Thống kê"
              active={activeTab === 'analytics'}
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
                title="Video trong thư viện"
                value={stats.totalVideos}
                icon="🎬"
                color="purple"
              />
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl" onClick={() => setActiveTab('create')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tạo bài học mới</h3>
                    <p className="text-blue-100">Bắt đầu tạo nội dung mới</p>
                  </div>
                  <div className="text-3xl">➕</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6 cursor-pointer hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl" onClick={() => setActiveTab('videos')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Thư viện Video</h3>
                    <p className="text-green-100">Quản lý video của bạn</p>
                  </div>
                  <div className="text-3xl">🎥</div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6 cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl" onClick={() => setActiveTab('analytics')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Xem thống kê</h3>
                    <p className="text-purple-100">Phân tích hiệu suất</p>
                  </div>
                  <div className="text-3xl">📊</div>
                </div>
              </div>
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

        {activeTab === 'videos' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Thư viện Video</h2>
              <p className="text-gray-600">Quản lý tất cả video của bạn</p>
            </div>
            <VideoLibrary />
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <TeacherAnalytics courses={courses} />
            <LearningAnalytics isTeacher={true} />
          </div>
        )}
      </div>

      {/* Notifications Modal */}
      <TeacherNotifications
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Settings Modal */}
      {showSettings && (
        <TeacherSettings
          onClose={() => setShowSettings(false)}
        />
      )}

      {/* Help Modal */}
      {showHelp && (
        <TeacherHelp
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboard;