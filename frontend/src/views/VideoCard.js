import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  const formatViews = (views) => {
    if (views >= 1000) {
      return `${(views/1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const formatPrice = (price) => {
    return price.replace(/[^\d]/g, '');
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
      {/* Video Thumbnail */}
      <div className="relative overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-40 sm:h-48 object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Duration Badge */}
        <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <i className="ri-play-fill text-2xl text-blue-600 ml-1"></i>
          </div>
        </div>

        {/* Purchased Badge */}
        {video.isPurchased && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
            <i className="ri-check-line"></i>
            <span>Đã mua</span>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-4 sm:p-6">
        {/* Topic & Level */}
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
            {video.topic}
          </span>
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">
            {video.level}
          </span>
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            {video.age}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {video.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {video.description}
        </p>

        {/* Instructor & Skill */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-2">
            <i className="ri-user-line"></i>
            <span>{video.instructor}</span>
          </div>
          <div className="flex items-center space-x-1">
            <i className="ri-focus-3-line"></i>
            <span>{video.skill}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <i className="ri-star-fill text-yellow-400"></i>
              <span className="font-medium">{video.rating}</span>
            </div>
            <div className="flex items-center space-x-1">
              <i className="ri-eye-line"></i>
              <span>{formatViews(video.views)} lượt xem</span>
            </div>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-blue-600">{video.price}</span>
            <span className="text-xs text-gray-500">Mua một lần</span>
          </div>
          
          {video.isPurchased ? (
            <Link
              to={`/video/${video.id}/watch`}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center space-x-2"
            >
              <i className="ri-play-circle-line"></i>
              <span>Xem ngay</span>
            </Link>
          ) : (
            <Link
              to={`/video/${video.id}`}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition duration-300 flex items-center space-x-2"
            >
              <i className="ri-shopping-cart-line"></i>
              <span className="hidden sm:inline">Mua ngay</span>
              <span className="sm:hidden">Mua</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoCard;