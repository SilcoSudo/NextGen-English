import React, { useState, useEffect, useRef } from "react";
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
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Video optimization states
  const [isBuffering, setIsBuffering] = useState(false);
  const [bufferHealth, setBufferHealth] = useState(0);
  const [videoError, setVideoError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [networkQuality, setNetworkQuality] = useState('good'); // good, fair, poor

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
      
      // Video info
      video: lesson.video || {},
      videoUrl: lesson.video?.url || lesson.videoUrl || '',
      thumbnail: lesson.thumbnail || lesson.video?.thumbnail,
      duration: lesson.video?.duration || lesson.duration || 0,
      
      // Learning content
      objectives: Array.isArray(lesson.objectives) ? lesson.objectives : [],
      skills: Array.isArray(lesson.skills) ? lesson.skills : [],
      
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

        // Fetch lesson details
        const lessonResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });

        if (lessonResponse.ok) {
          const lessonData = await lessonResponse.json();
          const transformedLesson = transformLesson(lessonData.data || lessonData);
          setLesson(transformedLesson);
        } else {
          throw new Error('Không thể tải thông tin bài học');
        }

        // Fetch user progress
        const progressResponse = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons/${id}/progress`, {
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

  // Adaptive quality based on network conditions
  useEffect(() => {
    if (videoRef.current && networkQuality) {
      const video = videoRef.current;
      
      // Adjust preload strategy based on network quality
      if (networkQuality === 'poor') {
        video.preload = 'none';
      } else if (networkQuality === 'fair') {
        video.preload = 'metadata';  
      } else {
        video.preload = 'auto';
      }
    }
  }, [networkQuality]);

  // Monitor video performance
  useEffect(() => {
    const monitorPerformance = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const video = videoRef.current;
        
        // Check if video is stalling
        if (video.readyState < 3) { // HAVE_FUTURE_DATA
          setIsBuffering(true);
        }
        
        // Auto-adjust playback rate if network is poor and buffering frequently
        if (networkQuality === 'poor' && isBuffering && playbackRate > 0.75) {
          setPlaybackRate(0.75);
          video.playbackRate = 0.75;
        }
      }
    }, 1000);

    return () => clearInterval(monitorPerformance);
  }, [networkQuality, isBuffering, playbackRate]);

  // Video event handlers
  const handlePlay = () => {
    setIsPlaying(true);
    // Update progress to watching status
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
      
      // Auto-save progress every 10 seconds
      if (Math.floor(current) % 10 === 0) {
        updateProgress(current, total);
      }
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    // Mark as completed
    updateProgress(duration, duration, true);
  };

  // Video optimization handlers
  const handleLoadStart = () => {
    setIsBuffering(true);
    setVideoError(null);
  };

  const handleCanPlay = () => {
    setIsBuffering(false);
    // Monitor buffer health
    if (videoRef.current) {
      const buffered = videoRef.current.buffered;
      if (buffered.length > 0) {
        const bufferEnd = buffered.end(buffered.length - 1);
        const currentTime = videoRef.current.currentTime;
        setBufferHealth(bufferEnd - currentTime);
      }
    }
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  const handleError = (e) => {
    const error = e.target.error;
    setVideoError(error);
    setIsBuffering(false);
    
    console.error('Video error:', error);
    
    // Auto retry logic
    if (retryCount < 3) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.load();
          setRetryCount(prev => prev + 1);
        }
      }, 2000);
    }
  };

  const handleProgress = () => {
    if (videoRef.current) {
      const buffered = videoRef.current.buffered;
      const currentTime = videoRef.current.currentTime;
      
      if (buffered.length > 0) {
        const bufferEnd = buffered.end(buffered.length - 1);
        const bufferHealth = bufferEnd - currentTime;
        setBufferHealth(bufferHealth);
        
        // Detect network quality based on buffer health
        if (bufferHealth > 30) {
          setNetworkQuality('good');
        } else if (bufferHealth > 10) {
          setNetworkQuality('fair');
        } else {
          setNetworkQuality('poor');
        }
      }
    }
  };

  const updateProgress = async (watchTime = currentTime, totalTime = duration, completed = false) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/lessons/${id}/progress`, {
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
    if (videoRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      const newTime = pos * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p>Đang tải bài học...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold mb-4">Oops! Có lỗi xảy ra</h2>
          <p className="text-gray-300 mb-6">{error || 'Không tìm thấy bài học!'}</p>
          <button
            onClick={() => navigate('/my-lessons')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Video Player */}
      <div className="relative bg-black">
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
          onLoadStart={handleLoadStart}
          onCanPlay={handleCanPlay}
          onWaiting={handleWaiting}
          onPlaying={handlePlaying}
          onError={handleError}
          onProgress={handleProgress}
        >
          <source src={lesson.videoUrl} type="video/mp4" />
          <p className="text-center text-gray-300 p-8">
            Trình duyệt của bạn không hỗ trợ phát video. 
            <br />
            <a href={lesson.videoUrl} className="text-blue-400 hover:underline">
              Tải video về máy
            </a>
          </p>
        </video>

        {/* Buffering Indicator */}
        {isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
              <p className="text-white text-lg">Đang tải...</p>
              {networkQuality === 'poor' && (
                <p className="text-yellow-300 text-sm mt-2">Kết nối mạng yếu</p>
              )}
            </div>
          </div>
        )}

        {/* Video Error Overlay */}
        {videoError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="text-center bg-red-900/80 p-6 rounded-lg">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-white mb-2">Lỗi phát video</h3>
              <p className="text-gray-300 mb-4">
                {videoError.message || 'Không thể phát video này'}
              </p>
              <button
                onClick={() => {
                  setVideoError(null);
                  setRetryCount(0);
                  if (videoRef.current) {
                    videoRef.current.load();
                  }
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
          {/* Progress Bar */}
          <div 
            className="w-full h-2 bg-gray-600 rounded-full cursor-pointer mb-4"
            onClick={handleSeek}
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
                onClick={() => isPlaying ? videoRef.current.pause() : videoRef.current.play()}
                className="w-12 h-12 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center transition-colors"
              >
                {isPlaying ? '⏸️' : '▶️'}
              </button>
              
              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Volume */}
              <div className="flex items-center space-x-2">
                <span>🔊</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => {
                    const vol = parseFloat(e.target.value);
                    setVolume(vol);
                    if (videoRef.current) videoRef.current.volume = vol;
                  }}
                  className="w-20"
                />
              </div>

              {/* Network Quality Indicator */}
              <div className="flex items-center space-x-1">
                <span className={`text-sm ${
                  networkQuality === 'good' ? 'text-green-400' : 
                  networkQuality === 'fair' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {networkQuality === 'good' ? '📶' : 
                   networkQuality === 'fair' ? '📶' : '📶'}
                </span>
                <span className="text-xs text-gray-300">
                  {networkQuality === 'good' ? 'HD' : 
                   networkQuality === 'fair' ? 'SD' : 'Chậm'}
                </span>
              </div>

              {/* Buffer Health (Development Only) */}
              {process.env.NODE_ENV === 'development' && (
                <div className="text-xs text-gray-400">
                  Buffer: {Math.round(bufferHealth)}s
                </div>
              )}

              {/* Playback Speed */}
              <select
                value={playbackRate}
                onChange={(e) => {
                  const rate = parseFloat(e.target.value);
                  setPlaybackRate(rate);
                  if (videoRef.current) videoRef.current.playbackRate = rate;
                }}
                className="bg-gray-700 text-white px-2 py-1 rounded text-sm"
              >
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
              </select>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
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
          className="absolute top-6 left-6 w-12 h-12 bg-black/50 backdrop-blur-sm hover:bg-black/70 rounded-full flex items-center justify-center transition-colors"
        >
          ←
        </button>
      </div>

      {/* Lesson Info Sidebar (Optional) */}
      <div className="fixed top-6 right-6 w-80 bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-bold mb-3">{lesson.title}</h2>
        
        {/* Progress */}
        {progress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-300 mb-1">
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

        {/* Lesson Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-center space-x-2">
            <span>👨‍🏫</span>
            <span>{lesson.teacherName}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>📊</span>
            <span>{lesson.level}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🎯</span>
            <span>{lesson.ageGroup} tuổi</span>
          </div>
        </div>

        {/* Learning Objectives */}
        {lesson.objectives && lesson.objectives.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold mb-2">Mục tiêu học tập:</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              {lesson.objectives.slice(0, 3).map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-400 mt-0.5">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LessonWatch;