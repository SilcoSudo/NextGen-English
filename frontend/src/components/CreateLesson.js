import React, { useState } from 'react';

const CreateLesson = ({ onLessonCreated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    category: 'vocabulary',
    ageGroup: '6-8',
    duration: '10',
    price: '0',
    objectives: [''],
    prerequisites: [''],
    status: 'draft',
    minigame: {
      enabled: false,
      title: '',
      description: '',
      url: '',
      type: 'other',
      requireVideoCompletion: true
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // File upload states
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [thumbnailUploadProgress, setThumbnailUploadProgress] = useState(0);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMinigameChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      minigame: {
        ...prev.minigame,
        [name]: type === 'checkbox' ? checked : value
      }
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

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index, field) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleVideoFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Expanded list of supported video MIME types
      const allowedTypes = [
        // Common formats
        'video/mp4', 'video/avi', 'video/mov', 'video/webm', 'video/ogg', 'video/ogv',
        // Mobile & streaming
        'video/3gpp', 'video/3gpp2',
        // Windows formats
        'video/x-ms-wmv', 'video/x-ms-asf', 'video/x-ms-wmx', 'video/x-ms-wvx',
        // High quality
        'video/x-matroska', 'video/x-flv', 'video/x-m4v', 'video/x-f4v',
        // MPEG family
        'video/mpeg', 'video/mpg', 'video/mpe', 'video/m2v', 'video/mp2t', 'video/vnd.dlna.mpeg-tts',
        'video/MP2T', 'video/mts', 'video/m2ts', 'video/ts',
        // Other
        'video/quicktime', 'video/x-msvideo', 'video/vob', 'video/divx', 'video/xvid',
        'video/h264', 'video/h265', 'video/vnd.rn-realvideo', 'application/vnd.rn-realmedia',
        'application/vnd.rn-realmedia-vbr'
      ];
      
      // Also check file extension as fallback
      const fileExt = file.name.split('.').pop().toLowerCase();
      const allowedExtensions = [
        'mp4', 'avi', 'mov', 'webm', 'ogg', 'ogv', '3gp', '3g2', 'wmv', 'asf', 'wmx', 'wvx',
        'mkv', 'm4v', 'flv', 'f4v', 'mpg', 'mpeg', 'mpe', 'm2v', 'm4p', 'm2ts', 'mts', 'ts',
        'vob', 'divx', 'xvid', 'h264', 'h265', 'hevc', 'rm', 'rmvb', 'dv', 'dat', 'mng'
      ];
      
      if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExt)) {
        setError('Chỉ hỗ trợ file video. Định dạng được hỗ trợ: MP4, AVI, MOV, WebM, MKV, FLV, WMV, MPG, MPEG, M4V, M2TS, TS, VOB, 3GP, 3G2, OGV, F4V, DIVX, XVID, H264, H265, RM, RMVB, DV, DAT và nhiều định dạng khác (tối đa 500MB)');
        return;
      }
      
      if (file.size > 500 * 1024 * 1024) {
        setError('File video quá lớn. Kích thước tối đa là 500MB');
        return;
      }
      
      setSelectedFile(file);
      setError('');
    }
  };

  const handleThumbnailSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ file hình ảnh định dạng JPG, PNG, GIF, WebP');
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        setError('File hình ảnh quá lớn. Kích thước tối đa là 10MB');
        return;
      }
      
      setSelectedThumbnail(file);
      setError('');
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!formData.title.trim() || !formData.description.trim()) {
        setError('Vui lòng nhập đầy đủ tiêu đề và mô tả bài học');
        return;
      }

      if (!selectedFile) {
        setError('Vui lòng chọn file video cho bài học');
        return;
      }

      if (!selectedThumbnail) {
        setError('Vui lòng chọn hình ảnh thumbnail cho bài học');
        return;
      }

      setSuccess('Đang tạo bài học với files...');

      // Create FormData for multipart upload
      const formDataToSend = new FormData();
      
      // Add files
      if (selectedFile) {
        formDataToSend.append('video', selectedFile);
      }
      if (selectedThumbnail) {
        formDataToSend.append('thumbnail', selectedThumbnail);
      }
      
      // Add lesson data
      formDataToSend.append('title', formData.title.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('ageGroup', formData.ageGroup);
      formDataToSend.append('duration', parseInt(formData.duration) || 10);
      formDataToSend.append('price', parseFloat(formData.price) || 0);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('level', formData.level);
      
      if (formData.minigame.enabled && formData.minigame.url) {
        formDataToSend.append('minigameUrl', formData.minigame.url);
      }
      
      // Add arrays
      const objectives = formData.objectives.filter(obj => obj && obj.trim() !== '');
      const prerequisites = formData.prerequisites.filter(req => req && req.trim() !== '');
      
      formDataToSend.append('objectives', JSON.stringify(objectives));
      formDataToSend.append('prerequisites', JSON.stringify(prerequisites));
      formDataToSend.append('tags', JSON.stringify([]));

      console.log('Sending FormData with files');

      const token = localStorage.getItem('authToken');
      const response = await fetch(`${window.location.origin}/api/lessons`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Don't set Content-Type for FormData - browser will set it automatically with boundary
        },
        body: formDataToSend
      });

      const data = await response.json();
      console.log('Response status:', response.status);
      console.log('Response data:', data);

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
          category: 'vocabulary',
          ageGroup: '6-8',
          duration: '10',
          price: '0',
          objectives: [''],
          prerequisites: [''],
          status: 'draft',
          minigame: {
            enabled: false,
            title: '',
            description: '',
            url: '',
            type: 'other',
            requireVideoCompletion: true
          }
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setUploadProgress(0);
        setThumbnailUploadProgress(0);
      } else {
        let errorMessage = data.message || 'Có lỗi xảy ra khi tạo bài học';
        if (data.errors && Array.isArray(data.errors)) {
          errorMessage += '\\n\\nChi tiết lỗi:\\n' + data.errors.map(err => `- ${err.msg || err.message || err}`).join('\\n');
        }
        console.error('API errors:', data.errors);
        setError(errorMessage);
      }
    } catch (err) {
      console.error('Create lesson error:', err);
      setError(err.message || 'Không thể kết nối tới server');
    } finally {
      setLoading(false);
      setUploading(false);
      setThumbnailUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tạo bài học mới</h2>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 whitespace-pre-line">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề bài học *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="VD: Học bảng chữ cái A-Z"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ
            </label>
            <select
              name="level"
              value={formData.level}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="beginner">Cơ bản</option>
              <option value="elementary">Sơ cấp</option>
              <option value="intermediate">Trung cấp</option>
              <option value="advanced">Nâng cao</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Mô tả bài học *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Mô tả chi tiết về nội dung và mục tiêu của bài học..."
            required
          />
        </div>

        {/* Video Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Video bài học *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {selectedFile ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-blue-600 text-2xl">🎥</div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                {uploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileSelect}
                  className="hidden"
                  id="video-upload"
                />
                <label
                  htmlFor="video-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="text-gray-400 text-4xl mb-4">🎥</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Chọn file video
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-xs text-gray-400">
                    Hỗ trợ 40+ định dạng: MP4, AVI, MOV, WebM, MKV, FLV, WMV, MPG, MPEG, M4V, M2TS, TS, VOB, 3GP, 3G2, OGV, F4V, DIVX, XVID, H264, H265, RM, RMVB và nhiều định dạng khác (tối đa 500MB)
                  </p>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Upload Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hình thumbnail *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {selectedThumbnail ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-green-600 text-2xl">🖼️</div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedThumbnail.name}</p>
                      <p className="text-sm text-gray-500">
                        {(selectedThumbnail.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedThumbnail(null)}
                    className="text-gray-400 hover:text-gray-600 text-xl"
                  >
                    ✕
                  </button>
                </div>
                
                {thumbnailUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${thumbnailUploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailSelect}
                  className="hidden"
                  id="thumbnail-upload"
                />
                <label
                  htmlFor="thumbnail-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="text-gray-400 text-4xl mb-4">🖼️</div>
                  <p className="text-lg font-medium text-gray-900 mb-2">
                    Chọn hình thumbnail
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    Kéo thả file vào đây hoặc click để chọn
                  </p>
                  <p className="text-xs text-gray-400">
                    Hỗ trợ: JPG, PNG, GIF, WebP (tối đa 10MB)
                  </p>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Course Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Độ tuổi
            </label>
            <select
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="6-8">6-8 tuổi</option>
              <option value="8-10">8-10 tuổi</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thời lượng (phút)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              max="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Giá (VND)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Danh mục
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="vocabulary">Từ vựng</option>
              <option value="grammar">Ngữ pháp</option>
              <option value="pronunciation">Phát âm</option>
              <option value="speaking">Nói</option>
              <option value="listening">Nghe</option>
              <option value="reading">Đọc</option>
              <option value="writing">Viết</option>
            </select>
          </div>

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
              <option value="published">Đã xuất bản</option>
            </select>
          </div>
        </div>

        {/* Learning Objectives */}
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
              {formData.objectives.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'objectives')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              )}
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
            Yêu cầu tiền đề
          </label>
          {formData.prerequisites.map((prerequisite, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={prerequisite}
                onChange={(e) => handleArrayChange(index, e.target.value, 'prerequisites')}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Yêu cầu ${index + 1}`}
              />
              {formData.prerequisites.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'prerequisites')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addArrayItem('prerequisites')}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            + Thêm yêu cầu
          </button>
        </div>

        {/* Minigame Settings */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Cài đặt Minigame</h3>
          
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.minigame.enabled}
                onChange={handleMinigameChange}
                className="mr-2"
              />
              <span className="text-sm font-medium text-gray-700">
                Bật minigame cho bài học này
              </span>
            </label>
          </div>

          {formData.minigame.enabled && (
            <div className="space-y-4 pl-6 border-l-2 border-blue-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  URL Minigame
                </label>
                <input
                  type="url"
                  name="url"
                  value={formData.minigame.url}
                  onChange={handleMinigameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://kahoot.it/challenge/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề minigame
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.minigame.title}
                  onChange={handleMinigameChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="VD: Quiz từ vựng bảng chữ cái"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mô tả minigame
                </label>
                <textarea
                  name="description"
                  value={formData.minigame.description}
                  onChange={handleMinigameChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Mô tả về trò chơi và cách chơi..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Hủy
            </button>
          )}
          <button
            type="submit"
            disabled={loading || uploading || thumbnailUploading || !selectedFile || !selectedThumbnail}
            className={`px-6 py-2 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              loading || uploading || thumbnailUploading || !selectedFile || !selectedThumbnail
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {loading || uploading || thumbnailUploading ? 'Đang xử lý...' : 'Tạo bài học'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLesson;