import React, { useState } from 'react';

const VideoPlayer = ({ videoUrl, title, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract video ID and platform from URL
  const getVideoInfo = (url) => {
    if (!url) return null;

    // YouTube patterns
    const youtubeRegex = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return {
        platform: 'youtube',
        id: youtubeMatch[1],
        embedUrl: `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0&modestbranding=1&showinfo=0`
      };
    }

    // Vimeo patterns
    const vimeoRegex = /(?:vimeo\.com\/)(\d+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return {
        platform: 'vimeo',
        id: vimeoMatch[1],
        embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0`
      };
    }

    // Local server video (API endpoint)
    const localVideoRegex = /\/api\/videos\/(.+)$/;
    const localMatch = url.match(localVideoRegex);
    if (localMatch) {
      return {
        platform: 'local',
        id: localMatch[1],
        embedUrl: url
      };
    }

    // Direct video file (mp4, webm, etc.)
    const videoExtensions = /\.(mp4|webm|ogg|mov|avi)(\?.*)?$/i;
    if (videoExtensions.test(url)) {
      return {
        platform: 'direct',
        id: null,
        embedUrl: url
      };
    }

    return null;
  };

  const videoInfo = getVideoInfo(videoUrl);

  const handleIframeLoad = () => {
    setLoading(false);
    setError('');
  };

  const handleIframeError = () => {
    setLoading(false);
    setError('Không thể tải video. Vui lòng kiểm tra lại URL.');
  };

  const handleVideoLoad = () => {
    setLoading(false);
    setError('');
  };

  const handleVideoError = () => {
    setLoading(false);
    setError('Không thể phát video. Định dạng video có thể không được hỗ trợ.');
  };

  if (!videoUrl) {
    return (
      <div className={`bg-gray-100 rounded-lg flex items-center justify-center ${className}`} style={{ minHeight: '300px' }}>
        <div className="text-center text-gray-500">
          <div className="text-4xl mb-3">📹</div>
          <p>Chưa có video cho bài học này</p>
        </div>
      </div>
    );
  }

  if (!videoInfo) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-6 ${className}`}>
        <div className="text-center text-red-600">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="font-medium mb-2">URL video không hợp lệ</p>
          <p className="text-sm">
            Hỗ trợ YouTube, Vimeo hoặc file video trực tiếp (mp4, webm, ogg)
          </p>
          <p className="text-xs mt-2 text-gray-600 break-all">
            URL hiện tại: {videoUrl}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải video...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
          <div className="text-center text-red-600 p-6">
            <div className="text-4xl mb-3">❌</div>
            <p className="font-medium mb-2">Lỗi tải video</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {videoInfo.platform === 'youtube' || videoInfo.platform === 'vimeo' ? (
        <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
          <iframe
            src={videoInfo.embedUrl}
            title={title || 'Video bài học'}
            className="absolute inset-0 w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            onLoad={handleIframeLoad}
            onError={handleIframeError}
          />
        </div>
      ) : videoInfo.platform === 'direct' || videoInfo.platform === 'local' ? (
        <video
          className="w-full h-auto max-h-96"
          controls
          preload="metadata"
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
        >
          <source src={videoInfo.embedUrl} type="video/mp4" />
          <source src={videoInfo.embedUrl} type="video/webm" />
          <source src={videoInfo.embedUrl} type="video/ogg" />
          Trình duyệt của bạn không hỗ trợ phát video HTML5.
        </video>
      ) : null}

      {/* Video Info Overlay */}
      {title && !loading && !error && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <h3 className="text-white font-medium truncate">{title}</h3>
          <div className="flex items-center gap-4 text-white/80 text-sm mt-1">
            <span className="capitalize">
              {videoInfo.platform === 'youtube' ? '📺 YouTube' :
               videoInfo.platform === 'vimeo' ? '🎬 Vimeo' :
               videoInfo.platform === 'local' ? '🎥 Video đã upload' :
               '🎥 Video trực tiếp'}
            </span>
            {videoInfo.platform !== 'direct' && videoInfo.id && (
              <span className="text-xs opacity-60">ID: {videoInfo.id}</span>
            )}
          </div>
        </div>
      )}

      {/* Controls Overlay for better UX */}
      {!loading && !error && (
        <div className="absolute top-4 right-4 flex gap-2">
          {videoInfo.platform === 'youtube' && (
            <a
              href={`https://youtube.com/watch?v=${videoInfo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
              title="Mở trên YouTube"
            >
              🔗
            </a>
          )}
          {videoInfo.platform === 'vimeo' && (
            <a
              href={`https://vimeo.com/${videoInfo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/50 text-white p-2 rounded-lg hover:bg-black/70 transition-colors"
              title="Mở trên Vimeo"
            >
              🔗
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;