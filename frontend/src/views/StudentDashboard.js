import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../models/AuthContext";

function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  return (
    <main className="container mx-auto px-4 py-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="relative mr-4">
            <img
              src="https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=100&height=100&seq=avatar1&orientation=squarish"
              alt="Student Avatar"
              className="w-16 h-16 rounded-full avatar object-top"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <i className="ri-check-line text-white text-xs"></i>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hello, {user?.name || 'User'}!</h1>
            <p className="text-gray-600">Ready to continue your English journey?</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-yellow-100 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 flex items-center justify-center mr-2">
              <i className="ri-fire-fill text-yellow-500"></i>
            </div>
            <span className="text-yellow-700 font-medium">7 Day Streak</span>
          </div>
          <div className="flex items-center bg-blue-100 px-3 py-1.5 rounded-full">
            <div className="w-6 h-6 flex items-center justify-center mr-2">
              <i className="ri-star-fill text-blue-500"></i>
            </div>
            <span className="text-blue-700 font-medium">380 Points</span>
          </div>
        </div>
      </div>
      {/* Nút quay lại trang chủ */}
      <button
        className="mb-8 bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-medium"
        onClick={() => navigate('/home')}
      >
        Quay lại Trang chủ
      </button>
      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Today's Goal */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Today's Goal</h2>
            <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
              <i className="ri-target-line text-primary"></i>
            </div>
          </div>
          <div className="mb-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm text-gray-600">Progress</span>
              <span className="text-sm font-medium text-primary">2/3 Activities</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: '66%' }}></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Complete 1 more activity to reach your daily goal!
          </p>
          <button className="w-full py-3 bg-primary text-white rounded-button font-medium flex items-center justify-center whitespace-nowrap !rounded-button">
            <i className="ri-play-circle-line mr-2"></i>
            Continue Learning
          </button>
        </div>
        {/* Weekly Progress */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Weekly Progress</h2>
            <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-full">
              <i className="ri-calendar-line text-purple-600"></i>
            </div>
          </div>
          <div className="flex justify-between mb-4">
            <div className="streak-day completed">M</div>
            <div className="streak-day completed">T</div>
            <div className="streak-day completed">W</div>
            <div className="streak-day active">T</div>
            <div className="streak-day">F</div>
            <div className="streak-day">S</div>
            <div className="streak-day">S</div>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>3 days completed</span>
            <span>4 days left</span>
          </div>
        </div>
        {/* Achievements */}
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Achievements</h2>
            <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full">
              <i className="ri-medal-line text-green-600"></i>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-1">
                <i className="ri-book-read-fill text-yellow-500 text-xl"></i>
              </div>
              <span className="text-xs text-gray-600">Reader</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-1">
                <i className="ri-mic-fill text-blue-500 text-xl"></i>
              </div>
              <span className="text-xs text-gray-600">Speaker</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <i className="ri-headphone-fill text-gray-400 text-xl"></i>
              </div>
              <span className="text-xs text-gray-400">Listener</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-1">
                <i className="ri-pen-nib-fill text-gray-400 text-xl"></i>
              </div>
              <span className="text-xs text-gray-400">Writer</span>
            </div>
          </div>
          <button className="w-full py-2 border border-gray-200 text-gray-700 rounded-button text-sm font-medium whitespace-nowrap !rounded-button">
            View All Badges
          </button>
        </div>
      </div>
      {/* Continue Learning */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Continue Learning</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg overflow-hidden card-shadow">
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=colorful%20classroom%20with%20children%20learning%20English%2C%20cartoon%20style%2C%20educational%20setting%2C%20bright%20colors%2C%20alphabet%20on%20wall&width=400&height=200&seq=lesson1&orientation=landscape"
                alt="Speaking Lesson"
                className="w-full h-48 object-cover object-top"
              />
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-primary">
                Lesson 3/8
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full mr-2">
                  <i className="ri-mic-line text-primary"></i>
                </div>
                <h3 className="font-bold text-gray-800">
                  Speaking: Greetings & Introductions
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Learn how to introduce yourself and greet others in English.
              </p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">60%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '60%' }}></div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">
                Continue
              </button>
            </div>
          </div>
          {/* Card 2 */}
          <div className="bg-white rounded-lg overflow-hidden card-shadow">
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=children%20listening%20to%20audio%20with%20headphones%20in%20classroom%2C%20cartoon%20style%2C%20educational%20setting%2C%20bright%20colors&width=400&height=200&seq=lesson2&orientation=landscape"
                alt="Listening Lesson"
                className="w-full h-48 object-cover object-top"
              />
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-primary">
                Lesson 2/6
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 flex items-center justify-center bg-purple-100 rounded-full mr-2">
                  <i className="ri-headphone-line text-purple-600"></i>
                </div>
                <h3 className="font-bold text-gray-800">
                  Listening: Daily Conversations
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Practice understanding everyday English conversations.
              </p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">35%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '35%' }}></div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">
                Continue
              </button>
            </div>
          </div>
          {/* Card 3 */}
          <div className="bg-white rounded-lg overflow-hidden card-shadow">
            <div className="relative">
              <img
                src="https://readdy.ai/api/search-image?query=children%20reading%20books%20in%20library%2C%20cartoon%20style%2C%20educational%20setting%2C%20bright%20colors%2C%20bookshelves&width=400&height=200&seq=lesson3&orientation=landscape"
                alt="Reading Lesson"
                className="w-full h-48 object-cover object-top"
              />
              <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full text-xs font-medium text-green-600">
                New
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 flex items-center justify-center bg-green-100 rounded-full mr-2">
                  <i className="ri-book-open-line text-green-600"></i>
                </div>
                <h3 className="font-bold text-gray-800">Reading: Short Stories</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Improve reading skills with fun and engaging short stories.
              </p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-xs text-gray-500">Progress</span>
                  <span className="text-xs font-medium text-gray-700">0%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '0%' }}></div>
                </div>
              </div>
              <button className="w-full py-2.5 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">
                Start
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Daily Missions */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Daily Missions</h2>
          <span className="text-sm text-gray-600">3 of 5 completed</span>
        </div>
        <div className="bg-white rounded-lg p-6 card-shadow">
          <div className="space-y-4">
            {/* Mission 1 */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full mr-3">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Complete a speaking exercise</h3>
                  <p className="text-sm text-gray-600">+15 points</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>
            {/* Mission 2 */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full mr-3">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Complete a listening exercise</h3>
                  <p className="text-sm text-gray-600">+10 points</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>
            {/* Mission 3 */}
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full mr-3">
                  <i className="ri-check-line text-green-600"></i>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">Complete a reading exercise</h3>
                  <p className="text-sm text-gray-600">+20 points</p>
                </div>
              </div>
              <span className="text-green-600 text-sm font-medium">Completed</span>
            </div>
            {/* Mission 4 */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Complete a writing exercise</h3>
                  <p className="text-sm text-gray-600">+25 points</p>
                </div>
              </div>
              <button className="py-1.5 px-4 bg-primary text-white rounded-button text-sm font-medium whitespace-nowrap !rounded-button">
                Start
              </button>
            </div>
            {/* Mission 5 */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full mr-3"></div>
                <div>
                  <h3 className="font-medium text-gray-800">Practice vocabulary</h3>
                  <p className="text-sm text-gray-600">+10 points</p>
                </div>
              </div>
              <button className="py-1.5 px-4 bg-gray-100 text-gray-500 rounded-button text-sm font-medium whitespace-nowrap !rounded-button" disabled>
                Locked
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Recommended for You */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
          <button className="text-primary text-sm font-medium">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg overflow-hidden card-shadow">
            <div className="relative">
              <img
                className="w-full h-36 object-cover object-top"
                src="https://readdy.ai/api/search-image?query=english%20learning%20game%20for%20kids%2C%20cartoon%20style%2C%20fun%20colorful%20interface&width=400&height=144&seq=rec1&orientation=landscape"
                alt="Recommended Game"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-2">Fun English Game</h3>
              <p className="text-sm text-gray-600 mb-2">Practice vocabulary and grammar with interactive games.</p>
              <button className="w-full py-2 bg-primary text-white rounded-button font-medium whitespace-nowrap !rounded-button">Play Now</button>
            </div>
          </div>
          {/* More cards có thể thêm ở đây */}
        </div>
      </div>
    </main>
  );
}

export default StudentDashboard;
