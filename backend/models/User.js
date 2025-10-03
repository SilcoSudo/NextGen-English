const bcrypt = require('bcryptjs');

// Mock database - trong thực tế sẽ là MongoDB/PostgreSQL
let users = [
  {
    id: 1,
    name: 'Administrator',
    username: 'admin',
    email: 'admin@nextgen.com',
    // Password: admin123 (đã được hash)
    password: '$2a$10$92IXUNpkjO0rOQ6MX2JZyOejYEUdQXJCCJ6IMN8m3gFQO8Pk/YE2m',
    role: 'admin',
    avatar: 'https://readdy.ai/api/search-image?query=professional%20admin%20avatar%20cartoon%20style%20business%20person%20with%20tie%2C%20friendly%20smile%2C%20digital%20art&width=60&height=60&seq=admin&orientation=squarish',
    createdAt: new Date('2025-01-01'),
    isActive: true
  },
  {
    id: 2,
    name: 'Emma Student',
    username: 'emma',
    email: 'emma@student.com',
    // Password: student123 (đã được hash)
    password: '$2a$10$HIbQaJ0eLKF1.Rj.z6DcxOKcL8x3fYnD3D6aLWpCK5gNFRF/JRweu',
    role: 'student',
    avatar: 'https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=60&height=60&seq=student&orientation=squarish',
    createdAt: new Date('2025-01-15'),
    isActive: true
  }
];

class User {
  // Tìm user theo email hoặc username
  static async findByEmailOrUsername(identifier) {
    try {
      const user = users.find(u => 
        u.email.toLowerCase() === identifier.toLowerCase() || 
        u.username.toLowerCase() === identifier.toLowerCase()
      );
      return user || null;
    } catch (error) {
      throw new Error('Lỗi khi tìm kiếm người dùng');
    }
  }

  // Tìm user theo ID
  static async findById(id) {
    try {
      const user = users.find(u => u.id === parseInt(id));
      return user || null;
    } catch (error) {
      throw new Error('Lỗi khi tìm kiếm người dùng theo ID');
    }
  }

  // Tạo user mới
  static async create(userData) {
    try {
      // Kiểm tra email đã tồn tại
      const existingUser = await this.findByEmailOrUsername(userData.email);
      if (existingUser) {
        throw new Error('Email đã được sử dụng');
      }

      // Kiểm tra username đã tồn tại
      const existingUsername = await this.findByEmailOrUsername(userData.username);
      if (existingUsername) {
        throw new Error('Tên đăng nhập đã được sử dụng');
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Tạo user mới
      const newUser = {
        id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1,
        name: userData.name || userData.username || 'User',
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        role: userData.role || 'student',
        avatar: userData.avatar || `https://readdy.ai/api/search-image?query=cute%20cartoon%20avatar%20of%20a%20young%20student%20with%20headphones%2C%20simple%20background%2C%20friendly%20smile%2C%20digital%20art%20style&width=60&height=60&seq=user${Date.now()}&orientation=squarish`,
        createdAt: new Date(),
        isActive: true
      };

      users.push(newUser);
      return newUser;
    } catch (error) {
      throw error;
    }
  }

  // Xác thực mật khẩu
  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error('Lỗi khi xác thực mật khẩu');
    }
  }

  // Cập nhật thông tin user
  static async updateById(id, updateData) {
    try {
      const userIndex = users.findIndex(u => u.id === parseInt(id));
      if (userIndex === -1) {
        throw new Error('Không tìm thấy người dùng');
      }

      // Cập nhật thông tin (không cho cập nhật password qua method này)
      const allowedUpdates = ['name', 'avatar', 'isActive'];
      Object.keys(updateData).forEach(key => {
        if (allowedUpdates.includes(key)) {
          users[userIndex][key] = updateData[key];
        }
      });

      return users[userIndex];
    } catch (error) {
      throw error;
    }
  }

  // Lấy tất cả users (admin only)
  static async findAll() {
    try {
      return users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
    } catch (error) {
      throw new Error('Lỗi khi lấy danh sách người dùng');
    }
  }

  // Đếm số lượng users
  static async count() {
    return users.length;
  }

  // Tạo safe user object (không có password)
  static toSafeObject(user) {
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  }
}

module.exports = User;