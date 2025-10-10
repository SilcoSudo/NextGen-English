import React, { useState } from 'react';

const MinigameButton = ({ minigame, hasCompletedVideo = false, onComplete }) => {
  const [isClicked, setIsClicked] = useState(false);

  if (!minigame || !minigame.enabled) {
    return null;
  }

  const handleClick = () => {
    if (minigame.requireVideoCompletion && !hasCompletedVideo) {
      alert('Bạn cần hoàn thành video bài học trước khi chơi minigame!');
      return;
    }

    setIsClicked(true);
    
    // Mở minigame trong tab mới
    window.open(minigame.url, '_blank', 'noopener,noreferrer');
    
    // Callback khi hoàn thành (có thể sử dụng để tracking)
    if (onComplete) {
      onComplete();
    }
  };

  const getMinigameIcon = (type) => {
    switch (type) {
      case 'kahoot':
        return '🎯';
      case 'quizizz':
        return '❓';
      case 'blooket':
        return '🎮';
      case 'gimkit':
        return '💎';
      default:
        return '🎪';
    }
  };

  const isDisabled = minigame.requireVideoCompletion && !hasCompletedVideo;

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl border-2 border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <span className="text-2xl mr-2">{getMinigameIcon(minigame.type)}</span>
          <div>
            <h3 className="font-bold text-purple-800">
              {minigame.title || 'Minigame'}
            </h3>
            {minigame.description && (
              <p className="text-sm text-purple-600">{minigame.description}</p>
            )}
          </div>
        </div>
        
        <div className="text-sm text-purple-600 font-medium capitalize">
          {minigame.type}
        </div>
      </div>

      {isDisabled && (
        <div className="mb-3 p-2 bg-yellow-100 border border-yellow-300 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⏳ Hoàn thành video bài học để mở khóa minigame
          </p>
        </div>
      )}

      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`
          w-full py-3 px-6 rounded-lg font-bold text-white transition-all duration-200 transform
          ${isDisabled 
            ? 'bg-gray-400 cursor-not-allowed' 
            : isClicked
              ? 'bg-green-600 hover:bg-green-700 shadow-lg scale-105'
              : 'bg-purple-600 hover:bg-purple-700 hover:shadow-lg hover:scale-105'
          }
        `}
      >
        {isClicked ? (
          <div className="flex items-center justify-center">
            <span className="mr-2">✅</span>
            Đã mở minigame - Chơi lại
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <span className="mr-2">🚀</span>
            Bắt đầu minigame
          </div>
        )}
      </button>

      {!isDisabled && (
        <p className="text-xs text-center text-purple-600 mt-2">
          Minigame sẽ mở trong tab mới
        </p>
      )}
    </div>
  );
};

export default MinigameButton;