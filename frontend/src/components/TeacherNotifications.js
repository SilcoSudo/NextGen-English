import React, { useState, useEffect } from 'react';

const TeacherNotifications = ({ isOpen, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock notifications data
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'course_published',
        title: 'Bài học đã được xuất bản',
        message: 'Bài học "English Grammar Fundamentals" đã được xuất bản thành công',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        read: false,
        icon: '✅'
      },
      {
        id: 2,
        type: 'new_student',
        title: 'Học viên mới',
        message: '5 học viên mới đã đăng ký khóa học của bạn',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
        read: false,
        icon: '👥'
      },
      {
        id: 3,
        type: 'video_uploaded',
        title: 'Upload video thành công',
        message: 'Video "Business English - Lesson 1" đã được upload và xử lý xong',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        read: true,
        icon: '🎥'
      },
      {
        id: 4,
        type: 'course_milestone',
        title: 'Cột mốc quan trọng',
        message: 'Bài học của bạn đã đạt 100 lượt xem!',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        read: true,
        icon: '🎉'
      },
      {
        id: 5,
        type: 'system',
        title: 'Cập nhật hệ thống',
        message: 'Tính năng analytics mới đã có sẵn trong dashboard',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        read: true,
        icon: '🔔'
      }
    ];

    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `${minutes} phút trước`;
    } else if (hours < 24) {
      return `${hours} giờ trước`;
    } else {
      return `${days} ngày trước`;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'course_published':
        return 'border-green-200 bg-green-50';
      case 'new_student':
        return 'border-blue-200 bg-blue-50';
      case 'video_uploaded':
        return 'border-purple-200 bg-purple-50';
      case 'course_milestone':
        return 'border-yellow-200 bg-yellow-50';
      case 'system':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 transition-all duration-200 cursor-pointer hover:bg-gray-50
                    ${!notification.read ? 'border-l-4 border-blue-500 bg-blue-50' : ''}
                  `}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl flex-shrink-0">
                      {notification.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className={`
                          text-sm font-medium truncate
                          ${!notification.read ? 'text-gray-900' : 'text-gray-700'}
                        `}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                        )}
                      </div>
                      <p className={`
                        text-sm mt-1 line-clamp-2
                        ${!notification.read ? 'text-gray-700' : 'text-gray-500'}
                      `}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {formatTime(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="text-gray-400 text-4xl mb-4">🔔</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Không có thông báo
              </h3>
              <p className="text-gray-600">
                Thông báo sẽ xuất hiện ở đây khi có hoạt động mới
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <button className="w-full text-center text-sm text-gray-600 hover:text-gray-800 font-medium">
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherNotifications;