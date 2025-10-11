const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');

async function setEmmaPassword() {
  try {
    await mongoose.connect('mongodb://localhost:27017/nextgen_english');
    console.log('✅ Connected to MongoDB');

    const emma = await User.findOne({ email: 'emma@student.com' });
    if (!emma) {
      console.log('❌ Emma not found');
      process.exit(1);
    }

    // Set simple password: emma123
    const hashedPassword = await bcrypt.hash('emma123', 10);
    emma.password = hashedPassword;
    await emma.save();

    console.log('🎉 Emma password set to: emma123');
    console.log('📧 Login credentials:');
    console.log('   Email: emma@student.com');
    console.log('   Password: emma123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

setEmmaPassword();