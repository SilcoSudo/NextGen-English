import React from 'react';

const TeacherPreview = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Preview */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                🎓 Dashboard Giảng viên
              </h1>
              <p className="text-gray-600 mt-1">
                Chào mừng trở lại, Giảng Viên Demo!
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Vai trò</p>
                <p className="font-medium text-blue-600">Teacher</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-medium">G</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs Preview */}
        <div className="mb-8">
          <div className="flex space-x-4">
            <button className="px-6 py-3 font-medium rounded-lg bg-blue-600 text-white shadow-md">
              Tổng quan
            </button>
            <button className="px-6 py-3 font-medium rounded-lg bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
              Quản lý bài học
            </button>
            <button className="px-6 py-3 font-medium rounded-lg bg-white text-gray-600 hover:bg-gray-50 border border-gray-200">
              Tạo bài học mới
            </button>
          </div>
        </div>

        {/* Statistics Cards Preview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng số bài học</p>
                <p className="text-2xl font-bold text-blue-600">5</p>
              </div>
              <div className="text-blue-500 text-3xl">📚</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đã xuất bản</p>
                <p className="text-2xl font-bold text-green-600">3</p>
              </div>
              <div className="text-green-500 text-3xl">✅</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Bản nháp</p>
                <p className="text-2xl font-bold text-yellow-600">2</p>
              </div>
              <div className="text-yellow-500 text-3xl">📝</div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Học viên</p>
                <p className="text-2xl font-bold text-purple-600">28</p>
              </div>
              <div className="text-purple-500 text-3xl">👥</div>
            </div>
          </div>
        </div>

        {/* Recent Courses Preview */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Bài học gần đây
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {/* Course 1 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">English Grammar Fundamentals</h3>
                  <p className="text-sm text-gray-600 mt-1">beginner • 120 phút</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Đã xuất bản
                  </span>
                  <span className="text-sm text-gray-500">Hôm nay</span>
                </div>
              </div>

              {/* Course 2 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">Business English Communication</h3>
                  <p className="text-sm text-gray-600 mt-1">intermediate • 90 phút</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Đã xuất bản
                  </span>
                  <span className="text-sm text-gray-500">Hôm qua</span>
                </div>
              </div>

              {/* Course 3 */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">IELTS Speaking Mastery</h3>
                  <p className="text-sm text-gray-600 mt-1">advanced • 150 phút</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                    Bản nháp
                  </span>
                  <span className="text-sm text-gray-500">2 ngày trước</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Lesson Preview */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">🚀 Preview: Tạo Bài Học Mới</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài học *
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nhập tiêu đề bài học"
                defaultValue="Advanced English Conversation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cấp độ *
              </label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value="beginner">Cơ bản</option>
                <option value="intermediate" selected>Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>

          {/* Video Upload Options Preview */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Video bài học *
            </label>
            
            <div className="flex flex-wrap gap-4 mb-4">
              <label className="flex items-center">
                <input type="radio" name="videoOption" value="url" className="mr-2" checked />
                <span className="text-sm">Nhập URL video</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="videoOption" value="upload" className="mr-2" />
                <span className="text-sm">Upload file video</span>
              </label>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium underline">
                📚 Chọn từ thư viện
              </button>
            </div>

            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://youtube.com/watch?v=..."
              defaultValue="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            />
            <p className="text-xs text-gray-500 mt-1">
              Hỗ trợ YouTube, Vimeo, hoặc link video trực tiếp
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button className="flex-1 py-3 px-6 rounded-lg font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200">
              🎬 Tạo Bài Học
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
              Hủy
            </button>
          </div>
        </div>

        {/* Features Highlight */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
            <div className="text-blue-600 text-2xl mb-3">📤</div>
            <h3 className="font-semibold text-gray-900 mb-2">Upload Video</h3>
            <p className="text-sm text-gray-600">
              Upload file video từ máy tính (MP4, AVI, MOV...) hoặc nhập URL từ YouTube, Vimeo
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg">
            <div className="text-green-600 text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">Quản lý thông minh</h3>
            <p className="text-sm text-gray-600">
              Dashboard với thống kê realtime, tìm kiếm, lọc và quản lý trạng thái bài học
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg">
            <div className="text-purple-600 text-2xl mb-3">🎥</div>
            <h3 className="font-semibold text-gray-900 mb-2">Video Library</h3>
            <p className="text-sm text-gray-600">
              Thư viện video riêng để tái sử dụng cho nhiều bài học khác nhau
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">🚀 Sẵn sàng bắt đầu?</h2>
          <p className="text-blue-100 mb-6">
            Setup hoàn tất! Chạy script setup để tạo demo data và trải nghiệm đầy đủ teacher UI/UX
          </p>
          <div className="bg-black bg-opacity-20 p-4 rounded-lg text-left font-mono text-sm">
            <p>cd backend</p>
            <p>node setupTeacherDemo.js</p>
            <p>yarn start</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherPreview;