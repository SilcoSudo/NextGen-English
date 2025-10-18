import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

function LessonWatch() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(false);
  const [showInfoPanel, setShowInfoPanel] = useState(true);

  // Auto-hide controls timer
  const controlsTimeoutRef = useRef(null);

  // Transform lesson data
  const transformLesson = (lesson) => {
    if (!lesson || typeof lesson !== 'object') {
      return null;
    }

    return {
      _id: lesson._id,
      id: lesson.id || lesson._id,
      title: String(lesson.title || 'Untitled Lesson'),
      description: String(lesson.description || 'No description'),
      level: String(lesson.level || 'Beginner'),
      ageGroup: String(lesson.ageGroup || 'all'),
      category: String(lesson.category || 'general'),

      // Video info - handle different URL formats from database
      videoUrl: (() => {
        const url = lesson.videoUrl || lesson.video?.url || '';
        
        try {
          // If it's already a full URL with http/https
          if (url.startsWith('http://') || url.startsWith('https://')) {
            // Convert localhost URLs to current domain
            if (url.includes('localhost:5000')) {
              const urlObj = new URL(url);
              const filename = urlObj.pathname.split('/').pop();
              return `${window.location.origin}/api/videos/${filename}`;
            }
            // For other domains, check if it's our API domain
            const urlObj = new URL(url);
            if (urlObj.hostname === window.location.hostname) {
              return url; // Same domain, return as is
            } else {
              return url; // External URL, return as is
            }
          }
          
          // Handle relative URLs (starting with /)
          if (url.startsWith('/')) {
            // If it starts with /api/, it's already a proper API URL
            if (url.startsWith('/api/')) {
              return `${window.location.origin}${url}`;
            }
            // If it starts with /uploads/, convert to API endpoint
            if (url.startsWith('/uploads/')) {
              const filename = url.split('/').pop();
              return `${window.location.origin}/api/videos/${filename}`;
            }
            // Other relative URLs, prepend origin
            return `${window.location.origin}${url}`;
          }
          
          // Handle URLs without protocol (relative paths or just filenames)
          if (!url.includes('://')) {
            // If it looks like a filename, assume it's in uploads/videos/
            if (url.includes('.') && !url.includes('/')) {
              return `${window.location.origin}/api/videos/${url}`;
            }
            // Otherwise treat as relative path
            return `${window.location.origin}/${url}`;
          }
          
          // Fallback
          return url;
        } catch (error) {
          console.warn('Error processing video URL:', url, error);
          return url;
        }
      })(),
      thumbnail: (() => {
        const thumb = lesson.thumbnail || lesson.video?.thumbnail || '';
        
        try {
          // If it's already a full URL with http/https
          if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
            // Convert localhost URLs to current domain
            if (thumb.includes('localhost:5000')) {
              const urlObj = new URL(thumb);
              const filename = urlObj.pathname.split('/').pop();
              return `${window.location.origin}/api/images/${filename}`;
            }
            // For other domains, check if it's our API domain
            const urlObj = new URL(thumb);
            if (urlObj.hostname === window.location.hostname) {
              return thumb; // Same domain, return as is
            } else {
              return thumb; // External URL (like Unsplash), return as is
            }
          }
          
          // Handle relative URLs (starting with /)
          if (thumb.startsWith('/')) {
            // If it starts with /api/, it's already a proper API URL
            if (thumb.startsWith('/api/')) {
              return `${window.location.origin}${thumb}`;
            }
            // If it starts with /uploads/, convert to API endpoint
            if (thumb.startsWith('/uploads/')) {
              const filename = thumb.split('/').pop();
              return `${window.location.origin}/api/images/${filename}`;
            }
            // Other relative URLs, prepend origin
            return `${window.location.origin}${thumb}`;
          }
          
          // Handle URLs without protocol (relative paths or just filenames)
          if (!thumb.includes('://')) {
            // If it looks like a filename, assume it's in uploads/images/
            if (thumb.includes('.') && !thumb.includes('/')) {
              return `${window.location.origin}/api/images/${thumb}`;
            }
            // Otherwise treat as relative path
            return `${window.location.origin}/${thumb}`;
          }
          
          // Fallback
          return thumb;
        } catch (error) {
          console.warn('Error processing thumbnail URL:', thumb, error);
          return 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80';
        }
      })(),
      duration: lesson.duration || lesson.video?.duration || 0,

      // Learning content
      objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
      prerequisites: Array.isArray(lesson.prerequisites) ? lesson.prerequisites : [],

      // Teacher info
      teacherName: (() => {
        if (lesson.createdBy && typeof lesson.createdBy === 'object') {
          return String(lesson.createdBy.name || 'Unknown Teacher');
        }
        return String(lesson.teacherName || 'Unknown Teacher');
      })(),

      teacherAvatar: (() => {
        if (lesson.createdBy && typeof lesson.createdBy === 'object') {
          return lesson.createdBy.avatar || '/avatar/default-teacher.jpg';
        }
        return '/avatar/default-teacher.jpg';
      })()
    };
  };

  // Fetch lesson and progress data
  useEffect(() => {
    const fetchLessonData = async () => {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          setError('Vui lòng đăng nhập để xem bài học.');
          setTimeout(() => navigate('/login'), 2000);
          return;
        }

        // Use relative API URLs to avoid CORS issues
        const baseUrl = window.location.origin;

        // Fetch lesson details
        const lessonResponse = await fetch(`${baseUrl}/api/lessons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          const transformedLesson = transformLesson(lessonData.data?.lesson || lessonData.data || lessonData);
          setLesson(transformedLesson);
        } else {
          const errorData = await lessonResponse.json();
          throw new Error(errorData.message || 'Không thể tải thông tin bài học');
        }

        // Fetch user progress
        const progressResponse = await fetch(`${baseUrl}/api/lessons/${id}/progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (progressResponse.ok) {
          const progressData = await progressResponse.json();
          setProgress(progressData.data || progressData);
        }

      } catch (err) {
        console.error('Fetch lesson error:', err);
        setError(err.message || 'Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLessonData();
    }
  }, [id, navigate]);

  const resetControlsTimeout = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  }, [isPlaying]);

  useEffect(() => {
    resetControlsTimeout();
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [isPlaying, resetControlsTimeout]);

  // Video event handlers
  const handlePlay = () => {
    setIsPlaying(true);
    updateProgress();
  };

  const handlePause = () => {
    setIsPlaying(false);
    updateProgress();
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setCurrentTime(current);
      setDuration(total);

      // Auto-save progress every 5 seconds
      if (Math.floor(current) % 5 === 0) {
        updateProgress(current, total);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Mark as completed
    updateProgress(duration, duration, true);
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  const handleError = (e) => {
    const error = e.target.error;
    console.error('Video error:', error);
    setError('Không thể phát video. Vui lòng thử lại.');
    setIsBuffering(false);
  };

  const updateProgress = async (watchTime = currentTime, totalTime = duration, completed = false) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const baseUrl = window.location.origin;

      const response = await fetch(`${baseUrl}/api/lessons/${id}/progress`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          watchTime: Math.floor(watchTime),
          totalTime: Math.floor(totalTime),
          completed
        })
      });

      if (response.ok) {
        const updatedProgress = await response.json();
        setProgress(updatedProgress.data || updatedProgress);
      } else {
        console.error('Progress update failed:', response.status, await response.text());
      }
    } catch (error) {
      console.error('Update progress error:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e) => {
    if (videoRef.current && duration) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Oops! Có lỗi xảy ra</h2>
          <p className="text-gray-300 mb-6 max-w-md">{error || 'Không tìm thấy bài học!'}</p>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              Thử lại
            </button>
            <button
              onClick={() => navigate('/my-lessons')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Video Player */}
      <div
        className={`relative bg-black group cursor-pointer ${showInfoPanel ? 'lg:mr-96' : ''}`}
        onMouseMove={resetControlsTimeout}
        onClick={togglePlay}
      >
        <video
          ref={videoRef}
          className="w-full h-screen object-contain"
          poster={lesson.thumbnail}
          preload="metadata"
          playsInline
          onPlay={handlePlay}
          onPause={handlePause}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onLoadedMetadata={() => setDuration(videoRef.current.duration)}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onError={handleError}
        >
          <source src={lesson.videoUrl} type="video/mp4" />
          <p className="text-center text-gray-300 p-8">
            Trình duyệt của bạn không hỗ trợ phát video.
            <br />
            <a href={lesson.videoUrl} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
              Tải video về máy
            </a>
          </p>
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-white text-sm">Đang tải...</p>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
          {/* Progress Bar */}
          <div
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-3 hover:h-3 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              handleSeek(e);
            }}
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-200"
              style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
            ></div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePlay();
                }}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors text-xl"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>

              <div className="text-sm font-medium">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Volume */}
              <div className="flex items-center space-x-2">
                <span className="text-sm">🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    e.stopPropagation();
                    handleVolumeChange(e);
                  }}
                  className="w-16 accent-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              {/* Fullscreen */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFullscreen();
                }}
                className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded flex items-center justify-center transition-colors"
              >
                📺
              </button>
            </div>
          </div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate('/my-lessons')}
          className={`absolute top-4 left-4 w-12 h-12 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors ${showControls ? 'opacity-100' : 'opacity-0'}`}
        >
          ←
        </button>

        {/* Toggle Info Panel Button - Desktop Only */}
        <button
          onClick={() => setShowInfoPanel(!showInfoPanel)}
          className={`hidden lg:flex absolute top-4 right-4 w-12 h-12 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full items-center justify-center transition-colors ${showControls ? 'opacity-100' : 'opacity-0'}`}
          title={showInfoPanel ? 'Ẩn thông tin bài học' : 'Hiện thông tin bài học'}
        >
          {showInfoPanel ? '❌' : 'ℹ️'}
        </button>

        {/* Play/Pause Overlay */}
        {!isPlaying && !isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center">
              <span className="text-3xl">▶️</span>
            </div>
          </div>
        )}
      </div>

      {/* Lesson Info Panel - Desktop Only */}
      <div className={`hidden lg:block fixed top-4 right-4 w-80 bg-gray-800/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700 max-h-[calc(100vh-2rem)] overflow-y-auto transition-all duration-300 ${showInfoPanel ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <h2 className="text-xl font-bold mb-4 line-clamp-2">{lesson.title}</h2>

        {/* Progress */}
        {progress && (
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-300 mb-2">
              <span>Tiến độ học tập</span>
              <span>{Math.round(progress.progressPercentage || 0)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress.progressPercentage || 0}%` }}
              ></div>
            </div>
            {progress.completed && (
              <div className="flex items-center mt-2 text-green-400 text-sm">
                <span className="mr-2">✅</span>
                <span>Hoàn thành!</span>
              </div>
            )}
          </div>
        )}

        {/* Lesson Details */}
        <div className="space-y-4 text-sm">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span>👨‍🏫</span>
            </div>
            <div>
              <div className="font-medium">{lesson.teacherName}</div>
              <div className="text-gray-400">Giảng viên</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Cấp độ</div>
              <div className="font-medium capitalize">{lesson.level}</div>
            </div>
            <div className="bg-gray-700/50 rounded-lg p-3">
              <div className="text-gray-400 text-xs mb-1">Độ tuổi</div>
              <div className="font-medium">{lesson.ageGroup}</div>
            </div>
          </div>

          <div className="bg-gray-700/50 rounded-lg p-3">
            <div className="text-gray-400 text-xs mb-1">Danh mục</div>
            <div className="font-medium capitalize">{lesson.category}</div>
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="mr-2">🎯</span>
              Mục tiêu học tập
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {lesson.objectives.map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5 text-xs">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Prerequisites */}
        {lesson.prerequisites && lesson.prerequisites.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-3 flex items-center">
              <span className="mr-2">📚</span>
              Kiến thức cần có
            </h3>
            <ul className="space-y-2 text-sm text-gray-300">
              {lesson.prerequisites.map((prereq, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-400 mt-0.5 text-xs">•</span>
                  <span>{prereq}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Mobile Lesson Info - Bottom Sheet */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-lg border-t border-gray-700 max-h-[40vh] overflow-y-auto">
        <div className="p-4">
          <h2 className="text-lg font-bold mb-3 line-clamp-2">{lesson.title}</h2>

          {/* Progress */}
          {progress && (
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-300 mb-2">
                <span>Tiến độ</span>
                <span>{Math.round(progress.progressPercentage || 0)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.progressPercentage || 0}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Quick Info */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div>
              <div className="text-gray-400">Cấp độ</div>
              <div className="font-medium capitalize">{lesson.level}</div>
            </div>
            <div>
              <div className="text-gray-400">Tuổi</div>
              <div className="font-medium">{lesson.ageGroup}</div>
            </div>
            <div>
              <div className="text-gray-400">Danh mục</div>
              <div className="font-medium capitalize">{lesson.category}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonWatch;