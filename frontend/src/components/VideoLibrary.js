import React, { useState, useEffect } from 'react';
import VideoPlayer from './VideoPlayer';

const VideoLibrary = ({ onVideoSelect, isModal = false, onClose }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }
      
      const response = await fetch(`${window.location.origin}/api/upload/my-videos`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setVideos(data.data || []);
      } else {
        setError(data.message || 'Không thể tải danh sách video');
      }
    } catch (err) {
      console.error('Fetch videos error:', err);
      setError('Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVideo = async (filename) => {
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        return;
      }
      
      const response = await fetch(`${window.location.origin}/api/upload/video/${filename}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setVideos(prev => prev.filter(video => video.filename !== filename));
        setDeleteConfirm(null);
        setError('');
      } else {
        setError(data.message || 'Không thể xóa video');
      }
    } catch (err) {
      console.error('Delete video error:', err);
      setError('Không thể kết nối tới server');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải video...</p>
        </div>
      </div>
    );
  }

  const content = (
    <div className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">
          Thư viện Video ({videos.length})
        </h2>
        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        )}
      </div>

      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <div key={video.filename} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Video Preview */}
              <div className="aspect-video bg-gray-100">
                <VideoPlayer
                  videoUrl={video.url}
                  title={video.filename}
                  className="w-full h-full"
                />
              </div>

              {/* Video Info */}
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2 truncate" title={video.filename}>
                  {video.filename}
                </h3>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>📦 Kích thước: {formatFileSize(video.size)}</p>
                  <p>📅 Upload: {formatDate(video.createdAt)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  {onVideoSelect ? (
                    <button
                      onClick={() => onVideoSelect(video)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      ✅ Chọn
                    </button>
                  ) : (
                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      👁️ Xem
                    </button>
                  )}
                  
                  <button
                    onClick={() => setDeleteConfirm(video.filename)}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Chưa có video nào
          </h3>
          <p className="text-gray-600">
            Upload video đầu tiên để bắt đầu xây dựng thư viện của bạn
          </p>
        </div>
      )}

      {/* Video Detail Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedVideo.filename}
              </h2>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <VideoPlayer
                videoUrl={selectedVideo.url}
                title={selectedVideo.filename}
                className="mb-6"
              />
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Thông tin file</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Tên file:</span> {selectedVideo.filename}</p>
                    <p><span className="font-medium">Kích thước:</span> {formatFileSize(selectedVideo.size)}</p>
                    <p><span className="font-medium">URL:</span> 
                      <a href={selectedVideo.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                        {selectedVideo.url}
                      </a>
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-900 mb-3">Thời gian</h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Upload:</span> {formatDate(selectedVideo.createdAt)}</p>
                    <p><span className="font-medium">Sửa đổi:</span> {formatDate(selectedVideo.modifiedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Xác nhận xóa video
            </h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa video "{deleteConfirm}"? Hành động này không thể hoàn tác.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteVideo(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
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

  if (isModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {content}
          </div>
        </div>
      </div>
    );
  }

  return content;
};

export default VideoLibrary;