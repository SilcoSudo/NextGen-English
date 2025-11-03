const express = require('express');
const router = express.Router();
const Progress = require('../models/Progress');
const Lesson = require('../models/Lesson');
const User = require('../models/User');

// Dashboard API
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user.id; // Assuming user ID is available in the request

    // Fetch user data
    const user = await User.findById(userId);

    // Fetch progress data
    const progress = await Progress.find({ userId });

    // Calculate today's goal
    const todayActivities = progress.filter(p => {
      const today = new Date();
      const activityDate = new Date(p.date);
      return (
        activityDate.getDate() === today.getDate() &&
        activityDate.getMonth() === today.getMonth() &&
        activityDate.getFullYear() === today.getFullYear()
      );
    });

    const completedActivities = todayActivities.filter(p => p.completed).length;
    const totalActivities = todayActivities.length;

    // Calculate weekly progress
    const weeklyProgress = progress.filter(p => {
      const today = new Date();
      const activityDate = new Date(p.date);
      const diffDays = Math.floor((today - activityDate) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays < 7;
    });

    const daysCompleted = new Set(
      weeklyProgress.filter(p => p.completed).map(p => new Date(p.date).getDay())
    );

    // Fetch lessons
    const lessons = await Lesson.find({ userId });

    // Response
    res.json({
      user: {
        name: user.name,
        points: user.stats.totalPoints,
        streak: user.stats.currentStreak
      },
      todayGoal: {
        completedActivities,
        totalActivities
      },
      weeklyProgress: Array.from(daysCompleted),
      lessons: lessons.map(lesson => ({
        id: lesson._id,
        title: lesson.title,
        progress: lesson.progress
      }))
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

module.exports = router;