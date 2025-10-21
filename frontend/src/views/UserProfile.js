import React, { useState, useEffect } from 'react';
import { useAuth } from '../models/AuthContext';
import { createAvatar } from '@dicebear/core';
import { adventurer } from '@dicebear/collection';
import Header from './Header'; // Correct the import path for Header component

// UserProfile component
function UserProfile() {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    bio: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Learning history state
  const [learningHistory, setLearningHistory] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);

  // Helper function to render avatar
  const renderAvatar = (avatar, size = 'w-20 h-20') => {
    const defaultAvatarUrl = 'https://api.dicebear.com/9.x/adventurer/svg';
    const avatarUrl = avatar || defaultAvatarUrl;
    return (
      <img
        src={avatarUrl}
        alt="Profile"
        className={`${size} rounded-full object-cover border-4 border-white shadow-lg`}
      />
    );
  };

  useEffect(() => {
    console.log('User state updated:', user);
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        bio: user.bio || ''
      });
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      // Load learning history
      const lessonsResponse = await fetch(`${window.location.origin}/api/lessons/my-lessons`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (lessonsResponse.ok) {
        const lessonsData = await lessonsResponse.json();
        setLearningHistory(lessonsData.lessons || []);
      }

      // Load payment history
      const paymentsResponse = await fetch(`${window.location.origin}/api/payment/history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (paymentsResponse.ok) {
        const paymentsData = await paymentsResponse.json();
        setPaymentHistory(paymentsData.payments || []);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      
      // Only send fields that have values (not empty strings)
      const updateData = {};
      if (profileData.name.trim()) updateData.name = profileData.name.trim();
      if (profileData.phone.trim()) updateData.phone = profileData.phone.trim();
      if (profileData.dateOfBirth) updateData.dateOfBirth = profileData.dateOfBirth;
      if (profileData.bio.trim()) updateData.bio = profileData.bio.trim();

      const response = await fetch(`${window.location.origin}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      const data = await response.json();

      console.log('Updated user data:', data.user); // Log the updated user data

      if (data.success) {
        updateUser(data.user);
        setIsEditing(false);
        setMessage('Thông tin cá nhân đã được cập nhật thành công!');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Lỗi kết nối. Vui lòng thử lại.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp');
      setMessageType('error');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${window.location.origin}/api/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setMessage('Mật khẩu đã được thay đổi thành công!');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Lỗi kết nối. Vui lòng thử lại.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarSelect = async (avatar) => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${window.location.origin}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ avatar })
      });

      const data = await response.json();

      if (data.success) {
        updateUser({ ...data.user, avatar });
        setMessage('Avatar đã được cập nhật thành công!');
        setMessageType('success');
      } else {
        setMessage(data.message || 'Có lỗi xảy ra khi cập nhật avatar');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Lỗi kết nối. Vui lòng thử lại.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const AvatarSelector = ({ onAvatarSelect, onClose }) => {
    const generateAvatars = () => {
      const avatars = [];
      for (let i = 0; i < 30; i++) { // Increase the number of avatars to 30
        const avatar = createAvatar(adventurer, { seed: `avatar-${i}` }).toString();
        avatars.push(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(avatar)}`);
      }
      return avatars;
    };

    const avatars = generateAvatars();

    return (
      <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4">Chọn Avatar</h2>
          <div className="grid grid-cols-5 gap-4"> {/* Adjust grid layout for 30 avatars */}
            {avatars.map((avatar, index) => (
              <img
                key={index}
                src={avatar}
                alt={`Avatar ${index + 1}`}
                className="w-24 h-24 rounded-full border-4 border-blue-500 shadow-lg cursor-pointer"
                onClick={() => onAvatarSelect(avatar)}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'profile', label: 'Thông tin cá nhân', icon: 'ri-user-line' },
    { id: 'security', label: 'Bảo mật', icon: 'ri-lock-line' },
    { id: 'learning', label: 'Lịch sử học tập', icon: 'ri-book-open-line' },
    { id: 'payments', label: 'Lịch sử thanh toán', icon: 'ri-bank-card-line' }
  ];

  console.log('Profile data state:', profileData);

  return (
    <div className="min-h-screen bg-gray-50 ">
      <Header /> {/* Replace Navbar with Header */}
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {renderAvatar(user?.avatar)}
              <button
                onClick={() => setShowAvatarSelector(true)}
                className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 shadow-lg transition-colors"
              >
                <i className="ri-edit-line text-sm"></i>
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{user?.name || 'User'}</h1>
              <p className="text-gray-600">{user?.email}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  user?.role === 'admin' ? 'bg-red-100 text-red-700' :
                  user?.role === 'teacher' ? 'bg-green-100 text-green-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role === 'admin' ? 'Admin' :
                   user?.role === 'teacher' ? 'Teacher' : 'Student'}
                </span>
                <span className="text-sm text-gray-500">
                  Tham gia: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg ${
            messageType === 'success' ? 'bg-green-50 border border-green-200 text-green-800' :
            'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <i className={`mr-2 ${messageType === 'success' ? 'ri-check-circle-line' : 'ri-error-warning-line'}`}></i>
              {message}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <i className={tab.icon}></i>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">Thông tin cá nhân</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    {isEditing ? 'Hủy' : 'Chỉnh sửa'}
                  </button>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Họ và tên
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Số điện thoại
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ngày sinh
                      </label>
                      <input
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giới thiệu bản thân
                    </label>
                    <textarea
                      value={profileData.bio}
                      onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
                      placeholder="Hãy viết một chút về bản thân bạn..."
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end space-x-4">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
                      >
                        {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Thay đổi mật khẩu</h2>
                <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <input
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      minLength={6}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    {loading ? 'Đang thay đổi...' : 'Thay đổi mật khẩu'}
                  </button>
                </form>
              </div>
            )}

            {/* Learning History Tab */}
            {activeTab === 'learning' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Lịch sử học tập</h2>
                {learningHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="ri-book-open-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Bạn chưa có bài học nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {learningHistory.map((lesson, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Đã mua: {new Date(lesson.purchaseDate).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-green-600">Đã hoàn thành</span>
                            <p className="text-xs text-gray-500">100%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Payment History Tab */}
            {activeTab === 'payments' && (
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Lịch sử thanh toán</h2>
                {paymentHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="ri-bank-card-line text-6xl text-gray-300 mb-4"></i>
                    <p className="text-gray-500">Bạn chưa có giao dịch nào</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paymentHistory.map((payment, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {payment.lessonTitle || 'Bài học'}
                            </h3>
                            <p className="text-sm text-gray-600">
                              Mã giao dịch: {payment.transactionId}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Thời gian: {new Date(payment.createdAt).toLocaleString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-medium ${
                              payment.status === 'success' ? 'text-green-600' :
                              payment.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {payment.status === 'success' ? 'Thành công' :
                               payment.status === 'pending' ? 'Đang xử lý' : 'Thất bại'}
                            </span>
                            <p className="text-sm font-semibold text-gray-800">
                              {payment.amount?.toLocaleString('vi-VN')}đ
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Ensure AvatarSelector modal is properly rendered */}
        {showAvatarSelector && (
          <AvatarSelector
            onAvatarSelect={handleAvatarSelect}
            onClose={() => setShowAvatarSelector(false)}
          />
        )}
      </div>
    </div>
  );
}

export default UserProfile;