import React from 'react';

const SetupGuide = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎓 Teacher UI/UX Setup Complete!
          </h1>
          <p className="text-xl text-gray-600">
            Hệ thống Teacher Dashboard đã sẵn sàng để sử dụng
          </p>
        </div>

        {/* Quick Access Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">👀</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Demo Preview</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Xem trước giao diện Teacher UI/UX mà không cần đăng nhập
            </p>
            <a 
              href="#/teacher-preview" 
              className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <span>Xem Demo</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <span className="text-2xl">🔐</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800">Teacher Login</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Đăng nhập với tài khoản teacher để trải nghiệm đầy đủ tính năng
            </p>
            <a 
              href="#/login" 
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <span>Đăng nhập</span>
              <i className="ri-arrow-right-line ml-2"></i>
            </a>
          </div>
        </div>

        {/* Demo Account Info */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">🔑 Demo Account</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Email</p>
              <code className="bg-black/20 px-3 py-1 rounded text-sm">teacher@nextgen.com</code>
            </div>
            <div className="bg-white/20 rounded-lg p-4">
              <p className="font-semibold mb-2">Password</p>
              <code className="bg-black/20 px-3 py-1 rounded text-sm">Teacher123!</code>
            </div>
          </div>
        </div>

        {/* Features Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">✨ Tính năng chính</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-2xl mr-3">📊</span>
              <span className="font-medium">Dashboard thống kê</span>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium">Tạo bài học mới</span>
            </div>
            <div className="flex items-center p-3 bg-purple-50 rounded-lg">
              <span className="text-2xl mr-3">🎥</span>
              <span className="font-medium">Upload video</span>
            </div>
            <div className="flex items-center p-3 bg-orange-50 rounded-lg">
              <span className="text-2xl mr-3">📚</span>
              <span className="font-medium">Quản lý bài học</span>
            </div>
            <div className="flex items-center p-3 bg-pink-50 rounded-lg">
              <span className="text-2xl mr-3">🎬</span>
              <span className="font-medium">Video Library</span>
            </div>
            <div className="flex items-center p-3 bg-cyan-50 rounded-lg">
              <span className="text-2xl mr-3">▶️</span>
              <span className="font-medium">Video Player</span>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-2xl p-6 mb-8">
          <h3 className="text-2xl font-bold mb-4">🛠️ Tech Stack</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-bold text-blue-300 mb-2">Frontend</h4>
              <ul className="text-sm space-y-1">
                <li>• React 19.1.0</li>
                <li>• Tailwind CSS</li>
                <li>• React Router</li>
                <li>• Context API</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-green-300 mb-2">Backend</h4>
              <ul className="text-sm space-y-1">
                <li>• Node.js + Express</li>
                <li>• MongoDB + Mongoose</li>
                <li>• JWT Authentication</li>
                <li>• Multer Upload</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-purple-300 mb-2">Features</h4>
              <ul className="text-sm space-y-1">
                <li>• Video Upload (500MB)</li>
                <li>• Video Streaming</li>
                <li>• File Management</li>
                <li>• Teacher Dashboard</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Setup Commands */}
        <div className="bg-gray-900 text-green-400 rounded-2xl p-6 font-mono text-sm">
          <h3 className="text-lg font-bold text-white mb-4">🚀 Quick Start Commands</h3>
          <div className="space-y-2">
            <div><span className="text-gray-500"># Windows - Double click:</span></div>
            <div className="text-yellow-300">start-teacher-demo.bat</div>
            <div className="mt-4"><span className="text-gray-500"># Manual setup:</span></div>
            <div>cd backend && npm install && node setupTeacherDemo.js && npm start</div>
            <div>cd frontend && yarn install && yarn start</div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center space-x-4">
            <a 
              href="#/teacher-preview" 
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              🎬 Xem Demo UI/UX
            </a>
            <a 
              href="#/login" 
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
            >
              🔐 Teacher Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetupGuide;