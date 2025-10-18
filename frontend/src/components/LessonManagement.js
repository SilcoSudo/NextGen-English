import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import EditLesson from './EditLesson';

const LessonManagement = ({ courses, onLessonUpdated, onLessonDeleted }) => {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter courses based on search term and status
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || course.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = async (courseId, newStatus) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${window.location.origin}/api/lessons/${courseId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();

      if (data.success) {
        onLessonUpdated(data.data);
        setError('');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi cập nhật trạng thái');
      }
    } catch (err) {
      console.error('Update status error:', err);
      setError('Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (courseId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${window.location.origin}/api/lessons/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        onLessonDeleted(courseId);
        setShowDeleteConfirm(null);
        setSelectedLesson(null);
        setError('');
      } else {
        setError(data.message || 'Có lỗi xảy ra khi xóa bài học');
      }
    } catch (err) {
      console.error('Delete course error:', err);
      setError('Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published':
        return 'Đã xuất bản';
      case 'draft':
        return 'Bản nháp';
      case 'archived':
        return 'Đã lưu trữ';
      default:
        return status;
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm bài học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="published">Đã xuất bản</option>
              <option value="draft">Bản nháp</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Danh sách bài học ({filteredCourses.length})
          </h2>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <div key={course._id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">
                        {course.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                        {getStatusText(course.status)}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                      <span>📈 Cấp độ: <span className="capitalize">{course.level}</span></span>
                      <span>⏱️ Thời lượng: {course.duration} phút</span>
                      <span>💰 Giá: {formatPrice(course.price)}</span>
                      <span>📅 Tạo: {formatDate(course.createdAt)}</span>
                    </div>

                    {course.objectives && course.objectives.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Mục tiêu:</p>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {course.objectives.slice(0, 2).map((objective, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {objective}
                            </li>
                          ))}
                          {course.objectives.length > 2 && (
                            <li className="text-gray-400 ml-3">
                              +{course.objectives.length - 2} mục tiêu khác
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => setSelectedLesson(course)}
                      className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm"
                    >
                      👁️ Xem chi tiết
                    </button>
                    
                    <button
                      onClick={() => {
                        console.log('🔧 Editing lesson:', course);
                        console.log('🎥 Video URL:', course.videoUrl);
                        console.log('🖼️ Thumbnail URL:', course.thumbnailUrl);
                        setEditingLesson(course);
                      }}
                      disabled={loading}
                      className="px-4 py-2 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors text-sm disabled:opacity-50"
                    >
                      ✏️ Chỉnh sửa
                    </button>
                    
                    {course.status === 'draft' && (
                      <button
                        onClick={() => handleStatusUpdate(course._id, 'published')}
                        disabled={loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50"
                      >
                        ✅ Xuất bản
                      </button>
                    )}
                    
                    {course.status === 'published' && (
                      <button
                        onClick={() => handleStatusUpdate(course._id, 'draft')}
                        disabled={loading}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm disabled:opacity-50"
                      >
                        📝 Về nháp
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowDeleteConfirm(course._id)}
                      disabled={loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50"
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Không tìm thấy bài học nào
            </h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter !== 'all' 
                ? 'Thử thay đổi từ khóa tìm kiếm hoặc bỏ lọc'
                : 'Chưa có bài học nào được tạo'
              }
            </p>
          </div>
        )}
      </div>

      {/* Course Detail Modal */}
      {selectedLesson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedLesson.title}
              </h2>
              <button
                onClick={() => setSelectedLesson(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Video Preview */}
              {selectedLesson.videoUrl && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Video bài học</h3>
                  <VideoPlayer 
                    videoUrl={selectedLesson.videoUrl}
                    title={selectedLesson.title}
                  />
                </div>
              )}

              {/* Course Info */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Thông tin cơ bản</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Cấp độ:</span> <span className="capitalize">{selectedLesson.level}</span></p>
                    <p><span className="font-medium">Thời lượng:</span> {selectedLesson.duration} phút</p>
                    <p><span className="font-medium">Giá:</span> {formatPrice(selectedLesson.price)}</p>
                    <p><span className="font-medium">Trạng thái:</span> 
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${getStatusColor(selectedLesson.status)}`}>
                        {getStatusText(selectedLesson.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Thời gian</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tạo:</span> {formatDate(selectedLesson.createdAt)}</p>
                    <p><span className="font-medium">Cập nhật:</span> {formatDate(selectedLesson.updatedAt)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Mô tả</h3>
                <p className="text-gray-600 leading-relaxed">
                  {selectedLesson.description}
                </p>
              </div>

              {/* Objectives */}
              {selectedLesson.objectives && selectedLesson.objectives.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Mục tiêu học tập</h3>
                  <ul className="space-y-2">
                    {selectedLesson.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="text-blue-500 mr-2 mt-1">•</span>
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Prerequisites */}
              {selectedLesson.prerequisites && selectedLesson.prerequisites.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Kiến thức tiên quyết</h3>
                  <ul className="space-y-2">
                    {selectedLesson.prerequisites.map((prerequisite, index) => (
                      <li key={index} className="flex items-start text-gray-600">
                        <span className="text-orange-500 mr-2 mt-1">•</span>
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Lesson Modal */}
      {editingLesson && (
        <EditLesson
          lesson={editingLesson}
          onLessonUpdated={(updatedLesson) => {
            onLessonUpdated(updatedLesson);
            setEditingLesson(null);
          }}
          onCancel={() => setEditingLesson(null)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Xác nhận xóa bài học
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài học này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                disabled={loading}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Đang xóa...' : 'Xóa'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LessonManagement;