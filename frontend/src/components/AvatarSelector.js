import React, { useState, useEffect } from 'react';
import {
  FaCat,
  FaDog,
  FaKiwiBird,
  FaCrow,
  FaFish,
  FaSpider,
  FaHorse,
  FaFrog,
  FaDragon,
  FaOtter,
  FaHippo,
  FaFeather,
  FaLeaf,
  FaAppleAlt,
  FaCarrot,
  FaSun,
  FaMoon,
  FaStar,
  FaHeart,
  FaSmile,
  FaLaugh,
  FaGrin,
  FaMeh,
  FaFrown
} from 'react-icons/fa';

// Danh sách avatar icon - sử dụng React Icons
const ICON_AVATARS = [
  { icon: FaCat, color: '#FF6B6B', name: 'Mèo' },
  { icon: FaDog, color: '#4ECDC4', name: 'Chó' },
  { icon: FaKiwiBird, color: '#45B7D1', name: 'Chim' },
  { icon: FaCrow, color: '#96CEB4', name: 'Quạ' },
  { icon: FaFish, color: '#FFEAA7', name: 'Cá' },
  { icon: FaSpider, color: '#DDA0DD', name: 'Nhện' },
  { icon: FaHorse, color: '#98D8C8', name: 'Ngựa' },
  { icon: FaFrog, color: '#F7DC6F', name: 'Ếch' },
  { icon: FaDragon, color: '#BB8FCE', name: 'Rồng' },
  { icon: FaOtter, color: '#85C1E9', name: 'Rái cá' },
  { icon: FaHippo, color: '#F8C471', name: 'Hà mã' },
  { icon: FaFeather, color: '#F1948A', name: 'Lông vũ' },
  { icon: FaLeaf, color: '#AED6F1', name: 'Lá' },
  { icon: FaAppleAlt, color: '#F5B041', name: 'Táo' },
  { icon: FaCarrot, color: '#EB984E', name: 'Cà rốt' },
  { icon: FaSun, color: '#F4D03F', name: 'Mặt trời' },
  { icon: FaMoon, color: '#AEB6BF', name: 'Mặt trăng' },
  { icon: FaStar, color: '#F7DC6F', name: 'Ngôi sao' },
  { icon: FaHeart, color: '#EC7063', name: 'Trái tim' },
  { icon: FaSmile, color: '#58D68D', name: 'Cười' },
  { icon: FaLaugh, color: '#F39C12', name: 'Cười lớn' },
  { icon: FaGrin, color: '#E74C3C', name: 'Cười toe' },
  { icon: FaMeh, color: '#95A5A6', name: 'Bình thường' },
  { icon: FaFrown, color: '#3498DB', name: 'Buồn' }
];

// Danh sách avatar hình ảnh - DiceBear API
const IMAGE_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=kitty&backgroundColor=ffeaa7&hair=short01&hairColor=fdcb6e&skinColor=f39c12&eyes=default&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=puppy&backgroundColor=a29bfe&hair=long01&hairColor=6c5ce7&skinColor=fbc531&eyes=happy&mouth=laugh',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bunny&backgroundColor=fdcb6e&hair=long02&hairColor=e84393&skinColor=e17055&eyes=hearts&mouth=twinkle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bearcub&backgroundColor=6c5ce7&hair=short02&hairColor=00b894&skinColor=f39c12&eyes=squint&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=pandacub&backgroundColor=00cec9&hair=long03&hairColor=fd79a8&skinColor=fbc531&eyes=sleepy&mouth=serious',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=owl&backgroundColor=e84393&hair=short03&hairColor=6c5ce7&skinColor=e17055&eyes=side&mouth=grimace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=fox&backgroundColor=fd79a8&hair=long04&hairColor=e84393&skinColor=f39c12&eyes=wink&mouth=sad',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=koala&backgroundColor=ffeaa7&hair=short04&hairColor=00b894&skinColor=fbc531&eyes=cry&mouth=vomit',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=rabbit&backgroundColor=f8a5c2&hair=long05&hairColor=fdcb6e&skinColor=f39c12&eyes=default&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=elephant&backgroundColor=74b9ff&hair=short05&hairColor=6c5ce7&skinColor=fbc531&eyes=happy&mouth=laugh',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=lion&backgroundColor=fdcb6e&hair=long06&hairColor=e84393&skinColor=e17055&eyes=hearts&mouth=twinkle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=tiger&backgroundColor=6c5ce7&hair=short06&hairColor=00b894&skinColor=f39c12&eyes=squint&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=monkey&backgroundColor=00cec9&hair=long07&hairColor=fd79a8&skinColor=fbc531&eyes=sleepy&mouth=serious',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=penguin&backgroundColor=e84393&hair=short07&hairColor=6c5ce7&skinColor=e17055&eyes=side&mouth=grimace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=dolphin&backgroundColor=fd79a8&hair=long08&hairColor=e84393&skinColor=f39c12&eyes=wink&mouth=sad',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=butterfly&backgroundColor=ffeaa7&hair=short08&hairColor=00b894&skinColor=fbc531&eyes=cry&mouth=vomit',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=giraffe&backgroundColor=f8a5c2&hair=long01&hairColor=fdcb6e&skinColor=f39c12&eyes=default&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=zebra&backgroundColor=74b9ff&hair=short01&hairColor=6c5ce7&skinColor=fbc531&eyes=happy&mouth=laugh',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=sloth&backgroundColor=fdcb6e&hair=long02&hairColor=e84393&skinColor=e17055&eyes=hearts&mouth=twinkle',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=hedgehog&backgroundColor=6c5ce7&hair=short02&hairColor=00b894&skinColor=f39c12&eyes=squint&mouth=smile',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=deer&backgroundColor=00cec9&hair=long03&hairColor=fd79a8&skinColor=fbc531&eyes=sleepy&mouth=serious',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=squirrel&backgroundColor=e84393&hair=short03&hairColor=6c5ce7&skinColor=e17055&eyes=side&mouth=grimace',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=bee&backgroundColor=fd79a8&hair=long04&hairColor=e84393&skinColor=f39c12&eyes=wink&mouth=sad',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=turtle&backgroundColor=ffeaa7&hair=short04&hairColor=00b894&skinColor=fbc531&eyes=cry&mouth=vomit'
];

function AvatarSelector({ currentAvatar, onAvatarSelect, onClose }) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);
  const [avatarType, setAvatarType] = useState(
    currentAvatar && typeof currentAvatar === 'object' && currentAvatar.icon ? 'icon' : 'image'
  );

  // Update selectedAvatar when currentAvatar changes
  useEffect(() => {
    if (currentAvatar) {
      setSelectedAvatar(currentAvatar);
      setAvatarType(typeof currentAvatar === 'object' && currentAvatar.icon ? 'icon' : 'image');
    }
  }, [currentAvatar]);

  const handleSelect = (avatar) => {
    setSelectedAvatar(avatar);
  };

  const handleConfirm = () => {
    onAvatarSelect(selectedAvatar);
    onClose();
  };

  const renderAvatarItem = (avatar, index) => {
    if (avatarType === 'icon') {
      const { icon: IconComponent, color, name } = avatar;
      const isSelected = selectedAvatar && typeof selectedAvatar === 'object' && 
                        selectedAvatar.icon === IconComponent && selectedAvatar.color === color;
      
      return (
        <button
          key={`icon-${index}`}
          onClick={() => handleSelect(avatar)}
          className={`relative group rounded-full overflow-hidden transition-all duration-200 ${
            isSelected
              ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
              : 'hover:scale-105'
          }`}
          title={name}
        >
          <div
            className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent
              size={32}
              color={color}
              className="drop-shadow-sm"
            />
          </div>
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center rounded-full">
              <i className="ri-check-line text-white text-lg font-bold"></i>
            </div>
          )}
        </button>
      );
    } else {
      const isSelected = selectedAvatar === avatar;
      
      return (
        <button
          key={`image-${index}`}
          onClick={() => handleSelect(avatar)}
          className={`relative group rounded-full overflow-hidden transition-all duration-200 ${
            isSelected
              ? 'ring-4 ring-blue-500 ring-offset-2 scale-110'
              : 'hover:scale-105'
          }`}
        >
          <img
            src={avatar}
            alt={`Avatar ${index + 1}`}
            className="w-16 h-16 object-cover"
            onError={(e) => {
              e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=default&backgroundColor=cccccc';
            }}
          />
          {isSelected && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
              <i className="ri-check-line text-white text-lg font-bold"></i>
            </div>
          )}
        </button>
      );
    }
  };

  const renderSelectedAvatar = () => {
    if (avatarType === 'icon' && selectedAvatar && typeof selectedAvatar === 'object') {
      const { icon: IconComponent, color } = selectedAvatar;
      return (
        <div className="flex items-center space-x-3">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border-2 border-blue-500"
            style={{ backgroundColor: `${color}20` }}
          >
            <IconComponent size={24} color={color} />
          </div>
          <span className="text-sm text-gray-600">Avatar đã chọn</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-3">
          <img
            src={selectedAvatar}
            alt="Selected avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
          />
          <span className="text-sm text-gray-600">Avatar đã chọn</span>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Chọn Avatar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-2xl"></i>
          </button>
        </div>

        {/* Avatar Type Selector */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Loại avatar:</span>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => {
                  setAvatarType('image');
                  setSelectedAvatar(currentAvatar && typeof currentAvatar === 'string' ? currentAvatar : IMAGE_AVATARS[0]);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  avatarType === 'image'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Hình ảnh
              </button>
              <button
                onClick={() => {
                  setAvatarType('icon');
                  setSelectedAvatar(currentAvatar && typeof currentAvatar === 'object' ? currentAvatar : ICON_AVATARS[0]);
                }}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  avatarType === 'icon'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Icon
              </button>
            </div>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
            {(avatarType === 'icon' ? ICON_AVATARS : IMAGE_AVATARS).map((avatar, index) =>
              renderAvatarItem(avatar, index)
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          {renderSelectedAvatar()}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AvatarSelector;