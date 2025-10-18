import React, { useState, useEffect } from 'react';

const EditLesson = ({ lesson, onLessonUpdated, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    level: 'beginner',
    duration: '',
    price: '',
    objectives: [''],
    prerequisites: [''],
    ageGroup: '6-8',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load lesson data when component mounts
  useEffect(() => {
    if (lesson) {
      console.log('📝 Loading lesson data for edit:', lesson);
      console.log('🎥 Current video URL:', lesson.videoUrl);
      console.log('🖼️ Current thumbnail URL:', lesson.thumbnailUrl);
      
      setFormData({
        title: lesson.title || '',
        description: lesson.description || '',
        level: lesson.level || 'beginner',
        duration: lesson.duration || '',
        price: lesson.price || '',
        objectives: lesson.objectives && lesson.objectives.length > 0 ? lesson.objectives : [''],
        prerequisites: lesson.prerequisites && lesson.prerequisites.length > 0 ? lesson.prerequisites : [''],
        ageGroup: lesson.ageGroup || '6-8',
        status: lesson.status || 'draft'
      });
    }
  }, [lesson]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.objectives];
    newObjectives[index] = value;
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives
    }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...prev.objectives, '']
    }));
  };

  const removeObjective = (index) => {
    const newObjectives = formData.objectives.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      objectives: newObjectives.length > 0 ? newObjectives : ['']
    }));
  };

  const handlePrerequisiteChange = (index, value) => {
    const newPrerequisites = [...formData.prerequisites];
    newPrerequisites[index] = value;
    setFormData(prev => ({
      ...prev,
      prerequisites: newPrerequisites
    }));
  };

  const addPrerequisite = () => {
    setFormData(prev => ({
      ...prev,
      prerequisites: [...prev.prerequisites, '']
    }));
  };

  const removePrerequisite = (index) => {
    const newPrerequisites = formData.prerequisites.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      prerequisites: newPrerequisites.length > 0 ? newPrerequisites : ['']
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (500MB max)
      if (file.size > 500 * 1024 * 1024) {
        setError('File video không được vượt quá 500MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ file video định dạng MP4, WebM, OGG, AVI, MOV');
        return;
      }
      
      setVideoFile(file);
      setError('');
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError('File thumbnail không được vượt quá 5MB');
        return;
      }
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Chỉ hỗ trợ file ảnh định dạng JPEG, PNG, JPG, WebP');
        return;
      }
      
      setThumbnailFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setUploadProgress(0);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.title.trim()) {
        setError('Vui lòng nhập tiêu đề bài học');
        setLoading(false);
        return;
      }

      if (!formData.description.trim()) {
        setError('Vui lòng nhập mô tả bài học');
        setLoading(false);
        return;
      }

      if (!formData.duration || formData.duration <= 0) {
        setError('Vui lòng nhập thời lượng hợp lệ');
        setLoading(false);
        return;
      }

      if (!formData.price || formData.price < 0) {
        setError('Vui lòng nhập giá hợp lệ');
        setLoading(false);
        return;
      }

      // Filter out empty objectives and prerequisites
      const cleanObjectives = formData.objectives.filter(obj => obj.trim());
      const cleanPrerequisites = formData.prerequisites.filter(req => req.trim());

      // Create FormData for file upload
      const updateData = new FormData();
      updateData.append('title', formData.title.trim());
      updateData.append('description', formData.description.trim());
      updateData.append('level', formData.level);
      updateData.append('duration', formData.duration);
      updateData.append('price', formData.price);
      updateData.append('ageGroup', formData.ageGroup);
      updateData.append('status', formData.status);
      updateData.append('objectives', JSON.stringify(cleanObjectives));
      updateData.append('prerequisites', JSON.stringify(cleanPrerequisites));

      // Add files if selected
      if (videoFile) {
        updateData.append('video', videoFile);
      }
      if (thumbnailFile) {
        updateData.append('thumbnail', thumbnailFile);
      }

      // Create XMLHttpRequest for upload progress
      const xhr = new XMLHttpRequest();

      // Track upload progress
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const percentComplete = (e.loaded / e.total) * 100;
          setUploadProgress(Math.round(percentComplete));
        }
      });

      // Handle response
      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            onLessonUpdated(response.data);
            onCancel(); // Close the edit modal
          } else {
            setError(response.message || 'Có lỗi xảy ra khi cập nhật bài học');
          }
        } else {
          setError('Có lỗi xảy ra khi cập nhật bài học');
        }
        setLoading(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        setError('Không thể kết nối tới server');
        setLoading(false);
        setUploadProgress(0);
      };

      // Send request
      xhr.open('PUT', `${window.location.origin}/api/lessons/${lesson._id}`);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.send(updateData);

    } catch (err) {
      console.error('Update lesson error:', err);
      setError('Có lỗi xảy ra khi cập nhật bài học');
      setLoading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            Chỉnh sửa bài học
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Upload Progress */}
          {loading && uploadProgress > 0 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700">Đang cập nhật bài học...</span>
                <span className="text-blue-700">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề bài học *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="Nhập tiêu đề bài học"
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Cấp độ
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                Thời lượng (phút) *
              </label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                disabled={loading}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="60"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Giá (VND) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                disabled={loading}
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                placeholder="100000"
              />
            </div>

            <div>
              <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-2">
                Độ tuổi
              </label>
              <select
                id="ageGroup"
                name="ageGroup"
                value={formData.ageGroup}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="6-8">6-8 tuổi</option>
                <option value="8-10">8-10 tuổi</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả bài học *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              placeholder="Mô tả chi tiết về bài học"
            />
          </div>

          {/* Video Upload */}
          <div>
            <label htmlFor="video" className="block text-sm font-medium text-gray-700 mb-2">
              Video bài học (tùy chọn - chỉ upload nếu muốn thay đổi)
            </label>
            
            {/* Current video display */}
            {lesson?.videoUrl && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium mb-1">
                  🎥 Video hiện tại:
                </p>
                <p className="text-sm text-green-600 break-all">
                  {lesson.videoUrl.split('/').pop()}
                </p>
                <p className="text-xs text-green-500 mt-1">
                  Video này sẽ được giữ nguyên nếu bạn không upload video mới
                </p>
              </div>
            )}
            
            <input
              type="file"
              id="video"
              accept="video/*"
              onChange={handleVideoChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Định dạng: MP4, AVI, MOV, WebM, OGG, 3GP, WMV, MKV, FLV, M4V, TS, MPG. Tối đa 500MB.
            </p>
            {videoFile && (
              <p className="text-sm text-blue-600 mt-1">
                📁 Video mới được chọn: {videoFile.name}
              </p>
            )}
          </div>

          {/* Thumbnail Upload */}
          <div>
            <label htmlFor="thumbnail" className="block text-sm font-medium text-gray-700 mb-2">
              Thumbnail (tùy chọn - chỉ upload nếu muốn thay đổi)
            </label>
            
            {/* Current thumbnail display */}
            {lesson?.thumbnailUrl && (
              <div className="mb-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700 font-medium mb-1">
                  🖼️ Thumbnail hiện tại:
                </p>
                <div className="flex items-center gap-3">
                  <img 
                    src={`${window.location.origin}/api/images/${lesson.thumbnailUrl.split('/').pop()}`}
                    alt="Current thumbnail"
                    className="w-16 h-16 object-cover rounded border"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <div>
                    <p className="text-sm text-green-600 break-all">
                      {lesson.thumbnailUrl.split('/').pop()}
                    </p>
                    <p className="text-xs text-green-500 mt-1">
                      Thumbnail này sẽ được giữ nguyên nếu bạn không upload ảnh mới
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleThumbnailChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            />
            <p className="text-sm text-gray-500 mt-1">
              Định dạng: JPEG, PNG, JPG, WebP. Tối đa 5MB.
            </p>
            {thumbnailFile && (
              <p className="text-sm text-blue-600 mt-1">
                📁 Thumbnail mới được chọn: {thumbnailFile.name}
              </p>
            )}
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
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder={`Mục tiêu ${index + 1}`}
                />
                {formData.objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addObjective}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
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
                  onChange={(e) => handlePrerequisiteChange(index, e.target.value)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                  placeholder={`Kiến thức ${index + 1}`}
                />
                {formData.prerequisites.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePrerequisite(index)}
                    disabled={loading}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addPrerequisite}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
            >
              + Thêm kiến thức
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              {loading ? 'Đang cập nhật...' : 'Cập nhật bài học'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLesson;