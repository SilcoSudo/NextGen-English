import React, { useState } from 'react';
import VideoLibrary from './VideoLibrary';

const CreateLesson = ({ onLessonCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    duration: '',
    price: 0,
    videoUrl: '',
    thumbnailUrl: '',
    objectives: [''],
    prerequisites: [''],
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [videoOption, setVideoOption] = useState('url'); // 'url' or 'upload'
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [showVideoLibrary, setShowVideoLibrary] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const handleArrayChange = (index, value, field) => {
    const newArray = [...formData[field]];
    newArray[index] = value;
    setFormData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Kiểm tra loại file
      const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/webm', 'video/ogg'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ file video định dạng MP4, AVI, MOV, WebM, OGG');
        return;
      }
      
      // Kiểm tra kích thước file (500MB)
      if (file.size > 500 * 1024 * 1024) {
        setError('File video quá lớn. Kích thước tối đa là 500MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const uploadVideo = async () => {
    if (!selectedFile) return null;
    
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const formData = new FormData();
      formData.append('video', selectedFile);
      
      const token = localStorage.getItem('token');
      
      // Sử dụng XMLHttpRequest để theo dõi progress
      const xhr = new XMLHttpRequest();
      
      return new Promise((resolve, reject) => {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const progress = Math.round((e.loaded * 100) / e.total);
            setUploadProgress(progress);
          }
        });
        
        xhr.addEventListener('load', () => {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            resolve(response.data);
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.message || 'Upload failed'));
          }
        });
        
        xhr.addEventListener('error', () => {
          reject(new Error('Network error during upload'));
        });
        
        xhr.open('POST', 'http://localhost:5000/api/upload/video');
        xhr.setRequestHeader('Authorization', `Bearer ${token}`);
        xhr.send(formData);
      });
    } catch (error) {
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleVideoSelect = (video) => {
    setFormData(prev => ({
      ...prev,
      videoUrl: video.url
    }));
    setVideoOption('url');
    setShowVideoLibrary(false);
    setError('');
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    const newArray = formData[field].filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      [field]: newArray.length > 0 ? newArray : ['']
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let videoUrl = formData.videoUrl;
      
      // Nếu chọn upload file, upload video trước
      if (videoOption === 'upload' && selectedFile) {
        setSuccess('Đang upload video...');
        const uploadResult = await uploadVideo();
        videoUrl = uploadResult.url;
        setSuccess('Upload video thành công! Đang tạo bài học...');
      }

      // Filter out empty strings from arrays
      const filteredData = {
        ...formData,
        videoUrl,
        objectives: formData.objectives.filter(obj => obj.trim() !== ''),
        prerequisites: formData.prerequisites.filter(req => req.trim() !== ''),
        duration: parseInt(formData.duration)
      };

      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(filteredData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Bài học đã được tạo thành công!');
        if (onLessonCreated) {
          onLessonCreated(data.data);
        }
        // Reset form
        setFormData({
          title: '',
          description: '',
          level: 'beginner',
          duration: '',
          price: 0,
          videoUrl: '',
          thumbnailUrl: '',
          objectives: [''],
          prerequisites: [''],
          status: 'draft'
        });
        setSelectedFile(null);
        setVideoOption('url');
        setUploadProgress(0);
      } else {
        setError(data.message || 'Có lỗi xảy ra khi tạo bài học');
      }
    } catch (err) {
      console.error('Create lesson error:', err);
      setError(err.message || 'Không thể kết nối tới server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tạo Bài Học Mới</h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ✕ Đóng
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài học *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập tiêu đề bài học"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ *
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Cơ bản</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời lượng (phút) *
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="60"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá (VNĐ)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả bài học *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Mô tả chi tiết về nội dung bài học..."
          />
        </div>

        {/* Video Section */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Video bài học *
          </label>
          
          {/* Video Option Selector */}
          <div className="flex flex-wrap gap-4 mb-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="videoOption"
                value="url"
                checked={videoOption === 'url'}
                onChange={(e) => setVideoOption(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Nhập URL video</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="videoOption"
                value="upload"
                checked={videoOption === 'upload'}
                onChange={(e) => setVideoOption(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm">Upload file video</span>
            </label>
            <button
              type="button"
              onClick={() => setShowVideoLibrary(true)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
            >
              📚 Chọn từ thư viện
            </button>
          </div>

          {videoOption === 'url' ? (
            <div>
              <input
                type="url"
                name="videoUrl"
                value={formData.videoUrl}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ YouTube, Vimeo, hoặc link video trực tiếp
              </p>
            </div>
          ) : (
            <div>
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="text-xs text-gray-500 mt-1">
                Hỗ trợ MP4, AVI, MOV, WebM, OGG. Tối đa 500MB
              </p>
              
              {selectedFile && (
                <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📹 {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                </div>
              )}

              {uploading && (
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Đang upload...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            URL Hình thu nhỏ
          </label>
          <input
            type="url"
            name="thumbnailUrl"
            value={formData.thumbnailUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/thumbnail.jpg"
          />
        </div>

        {/* Objectives */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mục tiêu học tập
          </label>
          {formData.objectives.map((objective, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={objective}
                onChange={(e) => handleArrayChange(index, e.target.value, 'objectives')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Mục tiêu ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'objectives')}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                disabled={formData.objectives.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('objectives')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Thêm mục tiêu
          </button>
        </div>

        {/* Prerequisites */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kiến thức tiên quyết
          </label>
          {formData.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => handleArrayChange(index, e.target.value, 'prerequisites')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Kiến thức ${index + 1}`}
              />
              <button
                type="button"
                onClick={() => removeArrayItem(index, 'prerequisites')}
                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                disabled={formData.prerequisites.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('prerequisites')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Thêm kiến thức tiên quyết
          </button>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Bản nháp</option>
            <option value="published">Xuất bản</option>
          </select>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={loading || uploading || (videoOption === 'upload' && !selectedFile) || (videoOption === 'url' && !formData.videoUrl.trim())}
            className={`
              flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200
              ${loading || uploading || (videoOption === 'upload' && !selectedFile) || (videoOption === 'url' && !formData.videoUrl.trim())
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
              }
              text-white
            `}
          >
            {loading || uploading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                {uploading ? `Đang upload... ${uploadProgress}%` : 'Đang tạo...'}
              </div>
            ) : (
              'Tạo Bài Học'
            )}
          </button>
          
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* Video Library Modal */}
      {showVideoLibrary && (
        <VideoLibrary
          isModal={true}
          onVideoSelect={handleVideoSelect}
          onClose={() => setShowVideoLibrary(false)}
        />
      )}
    </div>
  );
};

export default CreateLesson;