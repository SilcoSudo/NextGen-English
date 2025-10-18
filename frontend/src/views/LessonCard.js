import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

function LessonCard({ lesson }) {
  const navigate = useNavigate();
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  
  // Video preview state
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const videoRef = useRef(null);
  
  // Debug validation
  if (!lesson || typeof lesson !== 'object') {
    console.error('❌ LessonCard: Invalid lesson object:', lesson);
    return <div>Invalid lesson data</div>;
  }
  
  // Transform database objects to display values
  const safeLesson = {
    ...lesson,
    title: typeof lesson.title === 'string' ? lesson.title : 'Untitled Lesson',
    description: typeof lesson.description === 'string' ? lesson.description : 'No description',
    level: typeof lesson.level === 'string' ? lesson.level : 'Unknown',
    ageGroup: typeof lesson.ageGroup === 'string' ? lesson.ageGroup : '',
    
    // Store original price for logic checks
    originalPrice: lesson.price,
    
    // Transform pricing object to price string
    price: (() => {
      console.log('🔢 Price transform debug:', {
        rawPrice: lesson.price,
        rawPriceType: typeof lesson.price,
        hasPricing: !!lesson.pricing,
        pricingType: typeof lesson.pricing
      });
      
      if (typeof lesson.price === 'string') return lesson.price;
      if (lesson.pricing && typeof lesson.pricing === 'object') {
        if (lesson.pricing.type === 'free' || lesson.pricing.price === 0) {
          return 'Free';
        }
        const price = lesson.pricing.discountPrice || lesson.pricing.price;
        return price ? `${price.toLocaleString('vi-VN')}đ` : 'Free';
      }
      return lesson.price === 0 ? 'Free' : `${lesson.price?.toLocaleString('vi-VN') || 0}đ`;
    })(),
    
    // Handle skills array
    skills: Array.isArray(lesson.skills) ? lesson.skills : [],
    
    // Transform teacher info
    teacherName: (() => {
      if (typeof lesson.teacherName === 'string') return lesson.teacherName;
      if (lesson.createdBy && typeof lesson.createdBy === 'object') {
        return lesson.createdBy.name || 'Unknown Teacher';
      }
      return 'Unknown Teacher';
    })(),
    
    teacherAvatar: (() => {
      if (lesson.createdBy && typeof lesson.createdBy === 'object' && lesson.createdBy.avatar) {
        return lesson.createdBy.avatar;
      }
      return null;
    })(),
    
    // Transform stats
    purchases: lesson.totalPurchases || lesson.stats?.totalPurchases || 0,
    rating: lesson.averageRating || lesson.stats?.averageRating || 0,
    
    // Video info
    duration: lesson.video?.duration || lesson.duration || 0,
    
    // Enhanced thumbnail handling with URL conversion
    thumbnail: (() => {
      const thumb = lesson.thumbnail || lesson.video?.thumbnail;
      if (!thumb) return null;
      
      try {
        // If it's already a full URL with http/https
        if (thumb.startsWith('http://') || thumb.startsWith('https://')) {
          // Convert localhost URLs to current domain
          if (thumb.includes('localhost:5000')) {
            const url = new URL(thumb);
            const filename = url.pathname.split('/').pop();
            return `${window.location.origin}/api/images/${filename}`;
          }
          // For other domains, check if it's our API domain
          const url = new URL(thumb);
          if (url.hostname === window.location.hostname) {
            return thumb;
          } else {
            return thumb; // External URL
          }
        }
        
        // Handle relative URLs (starting with /)
        if (thumb.startsWith('/')) {
          if (thumb.startsWith('/api/')) {
            return `${window.location.origin}${thumb}`;
          }
          if (thumb.startsWith('/uploads/')) {
            const filename = thumb.split('/').pop();
            return `${window.location.origin}/api/images/${filename}`;
          }
          return `${window.location.origin}${thumb}`;
        }
        
        // Handle URLs without protocol
        if (!thumb.includes('://')) {
          if (thumb.includes('.') && !thumb.includes('/')) {
            return `${window.location.origin}/api/images/${thumb}`;
          }
          return `${window.location.origin}/${thumb}`;
        }
        
        return thumb;
      } catch (error) {
        console.warn('Error processing thumbnail URL:', thumb, error);
        return null;
      }
    })(),

    // Video URL processing
    videoUrl: (() => {
      const video = lesson.videoUrl;
      if (!video) return null;
      
      try {
        // If it's already a full URL with http/https
        if (video.startsWith('http://') || video.startsWith('https://')) {
          // Convert localhost URLs to current domain
          if (video.includes('localhost:5000')) {
            const url = new URL(video);
            const filename = url.pathname.split('/').pop();
            return `${window.location.origin}/api/videos/${filename}`;
          }
          return video;
        }
        
        // Handle relative URLs
        if (video.startsWith('/')) {
          if (video.startsWith('/api/')) {
            return `${window.location.origin}${video}`;
          }
          return `${window.location.origin}${video}`;
        }
        
        // Handle URLs without protocol
        if (!video.includes('://')) {
          return `${window.location.origin}/api/videos/${video}`;
        }
        
        return video;
      } catch (error) {
        console.warn('Error processing video URL:', video, error);
        return null;
      }
    })(),
    
    // isPurchased status from backend
    isPurchased: lesson.isPurchased === true
  };
  
  lesson = safeLesson;

  const handleClick = async (e) => {
    const lessonId = lesson._id || lesson.id;
    
    // Purchase lesson button
    if (e.target.name === "purchase" || e.target.closest('[name="purchase"]')) {
      e.stopPropagation();
      
      // Check if lesson is free (price === 0)
      const isFreeLesson = (() => {
        const originalPriceNum = Number(lesson.originalPrice);
        const priceStr = String(lesson.price).toLowerCase();
        const originalPriceStr = String(lesson.originalPrice).toLowerCase();
        
        const check1 = originalPriceNum === 0;
        const check2 = priceStr === 'free';
        const check3 = originalPriceStr === 'free';
        const check4 = priceStr === '0';
        
        console.log('🔍 Detailed free lesson check:', {
          originalPrice: lesson.originalPrice,
          originalPriceNum,
          price: lesson.price,
          priceStr,
          originalPriceStr,
          check1: `originalPriceNum === 0: ${check1}`,
          check2: `priceStr === 'free': ${check2}`,
          check3: `originalPriceStr === 'free': ${check3}`,
          check4: `priceStr === '0': ${check4}`,
          result: check1 || check2 || check3 || check4
        });
        
        return check1 || check2 || check3 || check4;
      })();
      console.log('🔍 Free lesson check:', {
        originalPrice: lesson.originalPrice,
        price: lesson.price,
        isFreeLesson
      });
      console.log('🛒 Purchase button clicked:', {
        lessonId,
        title: lesson.title,
        originalPrice: lesson.originalPrice,
        price: lesson.price,
        isFreeLesson,
        isPurchased
      });
      
      if (isFreeLesson) {
        // Enroll directly for free lessons
        console.log('✅ Enrolling free lesson directly');
        await handleEnrollFreeLesson(lessonId);
      } else {
        // Redirect to payment page for paid lessons
        console.log('💳 Redirecting to payment page for paid lesson');
        navigate(`/payment?lessonId=${lessonId}`);
      }
    }
    // Watch lesson button (if already purchased)
    else if (e.target.name === "watch" || e.target.closest('[name="watch"]')) {
      e.stopPropagation();
      navigate(`/lessons/${lessonId}/watch`);
    }
  };

  const handleEnrollFreeLesson = async (lessonId) => {
    console.log('🎓 Starting free lesson enrollment:', { lessonId });
    setEnrolling(true);
    setEnrollError('');
    
    try {
      const token = localStorage.getItem('authToken');
      console.log('🔑 Auth token present:', !!token);
      
      if (!token) {
        setEnrollError('Vui lòng đăng nhập để đăng ký khóa học');
        return;
      }

      const apiUrl = `${window.location.origin}/api/lessons/enroll`;
      console.log('📡 Making API call to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          lessonId: lessonId
        })
      });

      console.log('📥 API Response status:', response.status);
      const data = await response.json();
      console.log('📦 API Response data:', data);
      
      if (data.success) {
        console.log('✅ Enrollment successful, reloading page');
        // Refresh the page to update isPurchased status
        window.location.reload();
      } else if (response.status === 409 && data.message.includes('đã đăng ký')) {
        // User already enrolled - treat as success
        console.log('✅ User already enrolled, treating as success');
        setEnrollError(''); // Clear any error
        // Refresh the page to update isPurchased status
        window.location.reload();
      } else {
        console.log('❌ Enrollment failed:', data.message);
        setEnrollError(data.message || 'Đăng ký khóa học thất bại');
      }
    } catch (error) {
      console.error('🚨 Enroll free lesson error:', error);
      setEnrollError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setEnrolling(false);
    }
  };

  // Check if lesson is purchased from backend data
  const isPurchased = lesson.isPurchased === true;
  
  console.log('🎬 LessonCard Debug:', {
    lessonId: lesson._id || lesson.id,
    title: lesson.title,
    originalPrice: lesson.originalPrice,
    price: lesson.price,
    isPurchased: isPurchased,
    thumbnail: lesson.thumbnail,
    videoUrl: lesson.videoUrl
  });

  return (
    <div className="group bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer transform hover:-translate-y-2 border border-white/20">
      {/* Gradient overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all duration-500 rounded-2xl"></div>
      
      <div className="relative">
        <div className="relative overflow-hidden rounded-t-2xl">
          {lesson.videoUrl ? (
            <video
              ref={videoRef}
              poster={lesson.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80'}
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
              muted
              loop
              playsInline
              onMouseEnter={() => {
                setIsVideoHovered(true);
                if (videoRef.current) {
                  videoRef.current.play().catch(() => {
                    // Ignore play errors (user interaction required)
                  });
                }
              }}
              onMouseLeave={() => {
                setIsVideoHovered(false);
                if (videoRef.current) {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                }
              }}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              {/* Fallback to image if video fails */}
              <img 
                src={lesson.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80'} 
                alt={lesson.title} 
                className="w-full h-48 object-cover" 
              />
            </video>
          ) : (
            <img 
              src={lesson.thumbnail || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=250&fit=crop&auto=format&q=80'} 
              alt={lesson.title} 
              className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110" 
            />
          )}
          
          {/* Play button overlay for video */}
          {lesson.videoUrl && !isVideoHovered && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 backdrop-blur-sm rounded-full p-4 transition-all duration-300 group-hover:bg-black/70">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <span className="text-black text-lg ml-0.5">▶</span>
                </div>
              </div>
            </div>
          )}
          
          {/* Image overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
          
          {/* Video duration overlay */}
          {lesson.duration > 0 && (
            <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-lg px-3 py-1 rounded-full text-white text-sm font-medium">
              {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
            </div>
          )}
          
          {/* Rating badge */}
          {lesson.rating && typeof lesson.rating === 'number' && lesson.rating > 0 && (
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-lg px-3 py-1 rounded-full flex items-center space-x-1 shadow-lg">
              <span className="text-yellow-500">⭐</span>
              <span className="text-sm font-bold text-gray-800">{lesson.rating.toFixed(1)}</span>
            </div>
          )}

          {/* Purchased badge */}
          {isPurchased && (
            <div className="absolute top-4 right-4 bg-green-500/90 backdrop-blur-lg px-3 py-1 rounded-full text-white text-sm font-bold shadow-lg">
              ✓ Đã mua
            </div>
          )}
        </div>
      </div>
      
      <div className="p-6 relative z-10">
        {/* Tags và Age */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm">
              {lesson.level}
            </div>
            {lesson.ageGroup && (
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                👶 {lesson.ageGroup}
              </div>
            )}
          </div>
          {lesson.purchases && typeof lesson.purchases === 'number' && lesson.purchases > 0 && (
            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {lesson.purchases} lượt mua
            </div>
          )}
        </div>

        {/* Title with gradient */}
        <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-3 group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
          {lesson.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">{lesson.description}</p>

        {/* Learning objectives */}
        {lesson.objectives && Array.isArray(lesson.objectives) && lesson.objectives.length > 0 && (
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Bạn sẽ học được:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {lesson.objectives.slice(0, 2).map((objective, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>{objective}</span>
                </li>
              ))}
              {lesson.objectives.length > 2 && (
                <li className="text-gray-400 text-xs">
                  +{lesson.objectives.length - 2} mục tiêu khác
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Skills tags */}
        {lesson.skills && Array.isArray(lesson.skills) && lesson.skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {lesson.skills.slice(0, 3).map((skill, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200"
              >
                {typeof skill === 'string' ? skill : String(skill)}
              </span>
            ))}
            {lesson.skills.length > 3 && (
              <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                +{lesson.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Teacher Info */}
        <div className="flex items-center mb-6">
          <div className="relative">
            <img 
              src={lesson.teacherAvatar || '/avatar/emma.jpg'} 
              className="w-10 h-10 rounded-full border-3 border-white shadow-md" 
              alt="Teacher" 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-bold text-gray-800">{lesson.teacherName}</p>
            <p className="text-xs text-gray-500">Giáo viên</p>
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {lesson.price}
              </span>
              {lesson.originalPrice && (
                <span className="text-sm text-gray-400 line-through">{lesson.originalPrice}</span>
              )}
            </div>
            {lesson.originalPrice && (
              <div className="text-xs text-green-600 font-medium">
                Tiết kiệm {Math.round((1 - parseInt(lesson.price.replace(/[^\d]/g, '')) / parseInt(lesson.originalPrice.replace(/[^\d]/g, ''))) * 100)}%
              </div>
            )}
          </div>
          
          {isPurchased ? (
            <button
              name="watch"
              className="group/btn px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              onClick={handleClick}
            >
              <span className="flex items-center space-x-2">
                <span>Xem bài học</span>
                <span className="transform group-hover/btn:translate-x-1 transition-transform">▶️</span>
              </span>
            </button>
          ) : (
            <div className="space-y-2">
              <button
                name="purchase"
                disabled={enrolling}
                className="group/btn px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-bold text-sm transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl disabled:shadow-none"
                onClick={(e) => {
                  console.log('🖱️ Purchase button clicked directly');
                  handleClick(e);
                }}
              >
                {enrolling ? (
                  <span className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang đăng ký...</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <span>Mua ngay</span>
                    <span className="transform group-hover/btn:translate-x-1 transition-transform">🛒</span>
                  </span>
                )}
              </button>
              
              {enrollError && (
                <p className="text-red-500 text-xs text-center">{enrollError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LessonCard;