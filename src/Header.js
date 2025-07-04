import React from "react";

function Header({ activeTab, onTabChange }) {
  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-3xl font-bold text-blue-500 mr-2">
            <i className="fas fa-book-reader"></i>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            KidEnglish
          </h1>
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <button
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${
              activeTab === "home"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => onTabChange("home")}
          >
            Trang chủ
          </button>
          <button
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${
              activeTab === "courses"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => onTabChange("courses")}
          >
            Khám phá khóa học
          </button>
          <button
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${
              activeTab === "tutoring"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => onTabChange("tutoring")}
          >
            Khóa học đã mua
          </button>
          <button
            className={`font-medium text-sm whitespace-nowrap cursor-pointer ${
              activeTab === "payment"
                ? "text-blue-500"
                : "text-gray-600 hover:text-blue-500"
            }`}
            onClick={() => onTabChange("payment")}
          >
            Thanh toán
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học..."
              className="border border-gray-300 rounded-full py-2 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-40 md:w-64"
            />
            <button className="absolute right-3 top-2 text-gray-400 cursor-pointer">
              <i className="fas fa-search"></i>
            </button>
          </div>
          <button
            className="flex items-center space-x-2 bg-white hover:bg-gray-100 py-1.5 px-3 rounded-full text-sm font-medium transition duration-300 border border-gray-200 cursor-pointer"
            onClick={() => onTabChange("dashboard")}
          >
            <img
              src="https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=36&height=36&seq=avatar1&orientation=squarish"
              alt="User Avatar"
              className="w-8 h-8 rounded-full border-2 border-blue-400 object-cover"
            />
            <span className="text-gray-800 font-semibold">Emma</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
