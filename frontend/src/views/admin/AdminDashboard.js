import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../models/AuthContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalLessons: 0,
    totalRevenue: 0,
    totalEnrollments: 0,
    publishedLessons: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5000/api/analytics/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setStats(data.data.overview);
        }
      } else {
        setError('Không thể tải thống kê');
      }
    } catch (err) {
      console.error('Admin stats error:', err);
      setError('Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-gray-600 mt-2">Chào mừng trở lại, {user?.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition duration-300"
              >
                <i className="ri-home-line mr-2"></i>
                Về trang chủ
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.totalUsers.toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-line text-blue-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              {error ? (
                <span className="text-red-600 font-medium">{error}</span>
              ) : (
                <>
                  <span className="text-blue-600 font-medium">Active</span>
                  <span className="text-gray-500 ml-2">người dùng đang hoạt động</span>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng bài học</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : stats.totalLessons}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="ri-book-line text-green-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">
                {loading ? '...' : stats.publishedLessons}
              </span>
              <span className="text-gray-500 ml-2">bài học đã xuất bản</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Doanh thu</p>
                <p className="text-2xl font-bold text-gray-800">
                  {loading ? '...' : `${(stats.totalRevenue / 1000000).toFixed(1)}M VNĐ`}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="ri-money-dollar-circle-line text-yellow-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-yellow-600 font-medium">
                {loading ? '...' : `${stats.totalEnrollments}`}
              </span>
              <span className="text-gray-500 ml-2">lượt mua bài học</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Người dùng hoạt động</p>
                <p className="text-2xl font-bold text-gray-800">{stats.activeUsers}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-star-line text-purple-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+5%</span>
              <span className="text-gray-500 ml-2">so với tuần trước</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Người dùng mới</p>
                <p className="text-2xl font-bold text-gray-800">{stats.newUsersThisMonth}</p>
              </div>
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
                <i className="ri-user-add-line text-pink-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+15%</span>
              <span className="text-gray-500 ml-2">tháng này</span>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Khóa học hoàn thành</p>
                <p className="text-2xl font-bold text-gray-800">{stats.coursesCompleted.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <i className="ri-medal-line text-indigo-600 text-xl"></i>
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <span className="text-green-600 font-medium">+22%</span>
              <span className="text-gray-500 ml-2">so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Quản lý nhanh</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/admin/courses')}
                className="w-full flex items-center justify-between p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition duration-300"
              >
                <div className="flex items-center">
                  <i className="ri-book-line text-blue-600 mr-3"></i>
                  <span className="font-medium text-gray-800">Quản lý khóa học</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </button>
              
              <button
                onClick={() => navigate('/admin/users')}
                className="w-full flex items-center justify-between p-3 bg-green-50 hover:bg-green-100 rounded-lg transition duration-300"
              >
                <div className="flex items-center">
                  <i className="ri-user-line text-green-600 mr-3"></i>
                  <span className="font-medium text-gray-800">Quản lý người dùng</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </button>
              
              <button
                onClick={() => navigate('/admin/analytics')}
                className="w-full flex items-center justify-between p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition duration-300"
              >
                <div className="flex items-center">
                  <i className="ri-bar-chart-line text-purple-600 mr-3"></i>
                  <span className="font-medium text-gray-800">Báo cáo & Thống kê</span>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400"></i>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Hoạt động gần đây</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Khóa học mới được tạo</p>
                  <p className="text-xs text-gray-500">"Tiếng Anh cho trẻ 6-8 tuổi" - 2 giờ trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Người dùng mới đăng ký</p>
                  <p className="text-xs text-gray-500">15 người dùng mới - 4 giờ trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Thanh toán thành công</p>
                  <p className="text-xs text-gray-500">8 giao dịch - 6 giờ trước</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">Khóa học hoàn thành</p>
                  <p className="text-xs text-gray-500">12 học viên - 8 giờ trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Trạng thái hệ thống</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Máy chủ hoạt động bình thường</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Cơ sở dữ liệu ổn định</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Bảo mật hoạt động</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Backup tự động</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 