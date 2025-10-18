import React, { useState, useEffect } from 'react';
import { useAuth } from '../models/AuthContext';

const LearningAnalytics = ({ isTeacher = false }) => {
  const { user } = useAuth();
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${window.location.origin}/api/analytics/student`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Failed to fetch analytics');

        const data = await response.json();
        setAnalyticsData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchAnalytics();
  }, [user]);

  const getStreakBadge = (streak) => {
    if (streak >= 30) return { emoji: '🔥', text: 'Legendary!', color: 'text-red-500' };
    if (streak >= 14) return { emoji: '⚡', text: 'Amazing!', color: 'text-yellow-500' };
    if (streak >= 7) return { emoji: '🏆', text: 'Champion!', color: 'text-blue-500' };
    if (streak >= 3) return { emoji: '⭐', text: 'Great!', color: 'text-green-500' };
    return { emoji: '🌱', text: 'Keep going!', color: 'text-gray-500' };
  };

  const getStreakProgress = (current, target) => {
    const progress = Math.min((current / target) * 100, 100);
    return progress;
  };

  if (loading) return <div className="text-center py-4">Loading analytics...</div>;
  if (error) return <div className="text-red-500 text-center py-4">Error: {error}</div>;

  const streakBadge = analyticsData?.overview ? getStreakBadge(analyticsData.overview.currentStreak) : null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">
        {isTeacher ? 'Teaching Analytics' : 'Learning Progress & Streak'}
      </h3>

      {/* Learning Streak Section */}
      {analyticsData?.overview && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold flex items-center">
              <span className="mr-2">🔥</span>
              Learning Streak
            </h4>
            {streakBadge && (
              <div className={`flex items-center ${streakBadge.color}`}>
                <span className="text-2xl mr-1">{streakBadge.emoji}</span>
                <span className="font-medium">{streakBadge.text}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-1">
                {analyticsData.overview.currentStreak}
              </div>
              <div className="text-sm text-gray-600">Current Streak</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-1">
                {analyticsData.overview.longestStreak}
              </div>
              <div className="text-sm text-gray-600">Longest Streak</div>
              <div className="text-xs text-gray-500">days</div>
            </div>
            <div className="text-center md:col-span-1 col-span-2">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {analyticsData.overview.completionRate}%
              </div>
              <div className="text-sm text-gray-600">Completion Rate</div>
              <div className="text-xs text-gray-500">overall</div>
            </div>
          </div>

          {/* Streak Progress Bars */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to 7-day streak</span>
              <span>{analyticsData.overview.currentStreak}/7</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStreakProgress(analyticsData.overview.currentStreak, 7)}%` }}
              ></div>
            </div>

            <div className="flex justify-between text-sm">
              <span>Progress to 30-day streak</span>
              <span>{analyticsData.overview.currentStreak}/30</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${getStreakProgress(analyticsData.overview.currentStreak, 30)}%` }}
              ></div>
            </div>
          </div>

          <p className="text-sm text-gray-500 mt-3 text-center">
            Keep learning daily to maintain your streak! 🎯
          </p>
        </div>
      )}

      {/* Engagement Metrics */}
      {analyticsData?.overview && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-4">📊 Learning Statistics</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analyticsData.overview.totalLessons}</div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analyticsData.overview.completedLessons}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{analyticsData.overview.totalWatchTime}h</div>
              <div className="text-sm text-gray-600">Watch Time</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{analyticsData.overview.totalSpent.toLocaleString()} VND</div>
              <div className="text-sm text-gray-600">Total Spent</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {analyticsData?.recentActivity && analyticsData.recentActivity.length > 0 && (
        <div>
          <h4 className="text-lg font-semibold mb-4">📅 Recent Activity</h4>
          <div className="space-y-2">
            {analyticsData.recentActivity.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium">{activity.lessonTitle}</div>
                  <div className="text-sm text-gray-600">
                    {activity.category} • {activity.progressPercentage}% complete
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-medium ${
                    activity.status === 'completed' ? 'text-green-600' :
                    activity.status === 'in-progress' ? 'text-blue-600' : 'text-gray-600'
                  }`}>
                    {activity.status === 'completed' ? '✅ Completed' :
                     activity.status === 'in-progress' ? '⏳ In Progress' : '📚 Not Started'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(activity.enrolledAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningAnalytics;