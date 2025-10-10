import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import MinigameButton from "../components/MinigameButton";


function CourseLearn() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [videoCompleted, setVideoCompleted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/lessons/${id}`);
        const data = await response.json();
        
        if (data.success) {
          setCourse(data.data.lesson || data.data);
        } else {
          setError('Không thể tải bài học');
        }
      } catch (err) {
        console.error('Fetch lesson error:', err);
        setError('Lỗi kết nối');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLesson();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-4"></div>
          <div className="h-4 bg-gray-300 rounded mb-6"></div>
          <div className="h-48 bg-gray-300 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center">
        <div className="text-red-600 font-medium">{error || 'Không tìm thấy khóa học!'}</div>
      </div>
    );
  }

  const handleVideoComplete = () => {
    setVideoCompleted(true);
  };

  const handleMinigameComplete = () => {
    console.log('Student completed minigame');
    // Có thể thêm tracking hoặc cập nhật progress ở đây
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content - Video & Lesson */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Video Player */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="aspect-w-16 aspect-h-9" style={{ position: 'relative', width: '100%', paddingBottom: '56.25%' }}>
                {course.videoUrl ? (
                  <video
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                    src={course.videoUrl}
                    controls
                    className="rounded-t-2xl"
                    onEnded={() => setVideoCompleted(true)}
                    onTimeUpdate={(e) => {
                      // Mark as completed when 80% watched
                      const progress = (e.target.currentTime / e.target.duration) * 100;
                      if (progress >= 80) {
                        setVideoCompleted(true);
                      }
                    }}
                  >
                    Trình duyệt của bạn không hỗ trợ video HTML5.
                  </video>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold mb-2">Video sẽ có sẵn sớm</h3>
                      <p className="text-blue-100">Nội dung video đang được chuẩn bị</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Lesson Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center mr-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">
                      {course.title}
                    </h1>
                    <div className="flex items-center text-sm text-gray-600">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full mr-2">
                        ⭐ {course.stats?.averageRating || '4.9'}
                      </span>
                      <span>• {course.stats?.totalPurchases || '0'} học sinh đã mua</span>
                      <span className="mx-2">•</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {course.level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 mb-6">
                {course.description}
              </p>

              {/* Lesson Activities */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Ghi chú */}
                <div className="bg-orange-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">✏️</span>
                  </div>
                  <h3 className="font-semibold text-orange-800 mb-1">Thể loại</h3>
                  <p className="text-sm text-orange-600">
                    {course.category} • {course.duration} phút
                  </p>
                </div>

                {/* Từ vựng */}
                <div className="bg-purple-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-purple-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">📚</span>
                  </div>
                  <h3 className="font-semibold text-purple-800 mb-1">Mục tiêu</h3>
                  <p className="text-sm text-purple-600">
                    {course.objectives && course.objectives.length > 0 ? 
                     `${course.objectives.length} mục tiêu học tập` : 'Không có mục tiêu cụ thể'}
                  </p>
                </div>

                {/* Câu hỏi */}
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <div className="w-10 h-10 bg-green-400 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-white text-lg">❓</span>
                  </div>
                  <h3 className="font-semibold text-green-800 mb-1">Độ tuổi</h3>
                  <p className="text-sm text-green-600">
                    Phù hợp cho {course.ageGroup} tuổi
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center"
                  onClick={() => setVideoCompleted(true)}
                >
                  <span className="mr-2">✅</span>
                  Hoàn thành bài học
                </button>
                
                <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold py-4 px-6 rounded-xl transition-colors flex items-center justify-center">
                  <span className="mr-2">🎮</span>
                  Chơi Quiz Mini Game
                </button>
              </div>
            </div>

            {/* Minigame Section */}
            {course.minigameUrl && (
              <MinigameButton 
                minigame={{
                  enabled: true,
                  url: course.minigameUrl,
                  title: 'Minigame bài học',
                  description: 'Chơi game để củng cố kiến thức',
                  type: 'other',
                  requireVideoCompletion: true
                }}
                hasCompletedVideo={videoCompleted}
                onComplete={handleMinigameComplete}
              />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Next Lessons */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center">
                <span className="mr-2">📚</span>
                Bài học tiếp theo
              </h3>
              
              <div className="space-y-3">
                <div className="bg-blue-50 rounded-xl p-4">
                  <img 
                    src="/api/images/lesson-next.jpg" 
                    alt="Next lesson"
                    className="w-full h-24 object-cover rounded-lg mb-3"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <h4 className="font-semibold text-blue-800 mb-1">
                    Bài 6: Động vật trong nông trại
                  </h4>
                  <p className="text-sm text-blue-600">Học từ vựng về các con vật nuôi</p>
                </div>
              </div>
            </div>





          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseLearn; 