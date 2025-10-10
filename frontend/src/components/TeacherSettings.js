import React, { useState } from 'react';
import { useAuth } from '../models/AuthContext';

const TeacherSettings = ({ onClose }) => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: '',
    expertise: '',
    experience: '',
    education: '',
    avatar: user?.avatar || ''
  });

  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    courseNotifications: true,
    studentNotifications: true,
    marketingEmails: false,
    language: 'vi',
    timezone: 'Asia/Ho_Chi_Minh'
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Cập nhật thông tin thành công!');
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật thông tin');
    } finally {
      setLoading(false);
    }
  };

  const handlePreferencesSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Mock API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Cập nhật tùy chọn thành công!');
    } catch (err) {
      setError('Có lỗi xảy ra khi cập nhật tùy chọn');
    } finally {
      setLoading(false);
    }
  };

  const Section = ({ id, title, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      className={`
        w-full text-left px-4 py-3 rounded-lg transition-colors
        ${active 
          ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
          : 'text-gray-600 hover:bg-gray-50'
        }
      `}
    >
      {title}
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Cài đặt Teacher</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 p-4 space-y-2">
            <Section
              id="profile"
              title="👤 Thông tin cá nhân"
              active={activeSection === 'profile'}
              onClick={setActiveSection}
            />
            <Section
              id="preferences"
              title="⚙️ Tùy chọn"
              active={activeSection === 'preferences'}
              onClick={setActiveSection}
            />
            <Section
              id="security"  
              title="🔒 Bảo mật"
              active={activeSection === 'security'}
              onClick={setActiveSection}
            />
            <Section
              id="billing"
              title="💳 Thanh toán"
              active={activeSection === 'billing'}
              onClick={setActiveSection}
            />
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto max-h-[70vh]">
            {success && (
              <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600">{success}</p>
              </div>
            )}

            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thông tin cá nhân
                </h3>
                
                <form onSubmit={handleProfileSubmit} className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center space-x-4">
                    <img
                      src={profileData.avatar || "https://readdy.ai/api/search-image?query=professional%20teacher%20avatar%20placeholder&width=80&height=80&seq=avatar1&orientation=squarish"}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
                    />
                    <div>
                      <button
                        type="button"
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Đổi ảnh đại diện
                      </button>
                      <p className="text-xs text-gray-500 mt-1">
                        JPG, PNG tối đa 2MB
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới thiệu bản thân
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      placeholder="Viết một vài dòng giới thiệu về bản thân..."
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chuyên môn
                      </label>
                      <input
                        type="text"
                        value={profileData.expertise}
                        onChange={(e) => setProfileData(prev => ({...prev, expertise: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Tiếng Anh giao tiếp, IELTS, TOEIC..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kinh nghiệm (năm)
                      </label>
                      <input
                        type="number"
                        value={profileData.experience}
                        onChange={(e) => setProfileData(prev => ({...prev, experience: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Học vấn
                    </label>
                    <input
                      type="text"
                      value={profileData.education}
                      onChange={(e) => setProfileData(prev => ({...prev, education: e.target.value}))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cử nhân Ngôn ngữ Anh, Đại học ABC..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                  </button>
                </form>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Tùy chọn cá nhân
                </h3>
                
                <form onSubmit={handlePreferencesSubmit} className="space-y-6">
                  <div>
                    <h4 className="text-md font-medium text-gray-900 mb-3">
                      Thông báo
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.emailNotifications}
                          onChange={(e) => setPreferences(prev => ({...prev, emailNotifications: e.target.checked}))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Nhận thông báo qua email
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.courseNotifications}
                          onChange={(e) => setPreferences(prev => ({...prev, courseNotifications: e.target.checked}))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Thông báo về bài học mới
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.studentNotifications}
                          onChange={(e) => setPreferences(prev => ({...prev, studentNotifications: e.target.checked}))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Thông báo về học viên mới
                        </span>
                      </label>
                      
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={preferences.marketingEmails}
                          onChange={(e) => setPreferences(prev => ({...prev, marketingEmails: e.target.checked}))}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          Email marketing và khuyến mãi
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngôn ngữ
                      </label>
                      <select
                        value={preferences.language}
                        onChange={(e) => setPreferences(prev => ({...prev, language: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="vi">Tiếng Việt</option>
                        <option value="en">English</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Múi giờ
                      </label>
                      <select
                        value={preferences.timezone}
                        onChange={(e) => setPreferences(prev => ({...prev, timezone: e.target.value}))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="Asia/Ho_Chi_Minh">GMT+7 (Việt Nam)</option>
                        <option value="Asia/Bangkok">GMT+7 (Bangkok)</option>
                        <option value="Asia/Jakarta">GMT+7 (Jakarta)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Đang lưu...' : 'Lưu tùy chọn'}
                  </button>
                </form>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Bảo mật tài khoản
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">
                      🔐 Đổi mật khẩu
                    </h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Để bảo vệ tài khoản, bạn nên đổi mật khẩu định kỳ
                    </p>
                    <button className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                      Đổi mật khẩu
                    </button>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800 mb-2">
                      📱 Xác thực 2 bước
                    </h4>
                    <p className="text-sm text-green-700 mb-3">
                      Thêm lớp bảo mật cho tài khoản của bạn
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                      Kích hoạt 2FA
                    </button>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">
                      📋 Phiên đăng nhập
                    </h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Xem và quản lý các thiết bị đã đăng nhập
                    </p>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Xem phiên hoạt động
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Billing Section */}
            {activeSection === 'billing' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Thanh toán và Doanh thu
                </h3>
                
                <div className="space-y-6">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800 mb-2">
                      💰 Thông tin doanh thu
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-purple-700">Doanh thu tháng này:</p>
                        <p className="font-bold text-purple-900">2,500,000 VNĐ</p>
                      </div>
                      <div>
                        <p className="text-purple-700">Tổng doanh thu:</p>
                        <p className="font-bold text-purple-900">15,750,000 VNĐ</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-800 mb-2">
                      🏦 Thông tin ngân hàng
                    </h4>
                    <p className="text-sm text-gray-700 mb-3">
                      Cập nhật thông tin ngân hàng để nhận thanh toán
                    </p>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm">
                      Cập nhật thông tin
                    </button>
                  </div>

                  <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-800 mb-2">
                      📊 Báo cáo doanh thu
                    </h4>
                    <p className="text-sm text-orange-700 mb-3">
                      Tải xuống báo cáo chi tiết về doanh thu
                    </p>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm">
                      Tải báo cáo
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherSettings;