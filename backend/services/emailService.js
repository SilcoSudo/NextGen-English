const nodemailer = require('nodemailer');

// Cấu hình transporter
const createTransporter = () => {
  // Sử dụng Gmail SMTP (có thể thay đổi theo nhu cầu)
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // email gửi
      pass: process.env.EMAIL_PASSWORD // app password (không phải password thường)
    }
  });
};

// Gửi email xác thực
const sendVerificationEmail = async (to, verificationToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
    
    const mailOptions = {
      from: {
        name: 'NextGen English',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: '🎓 Xác thực tài khoản NextGen English',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎓 NextGen English</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #667eea; margin-top: 0;">Chào mừng ${userName}!</h2>
            
            <p>Cảm ơn bạn đã đăng ký tài khoản NextGen English. Để hoàn tất quá trình đăng ký, vui lòng xác thực địa chỉ email của bạn.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);">
                ✅ Xác thực tài khoản
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Lưu ý:</strong> Link xác thực sẽ hết hạn sau 24 giờ. Nếu bạn không thực hiện hành động này, vui lòng bỏ qua email này.
            </p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              Nếu bạn gặp khó khăn với nút bên trên, hãy copy và paste link sau vào trình duyệt:<br>
              <a href="${verificationUrl}" style="color: #667eea; word-break: break-all;">${verificationUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
              © 2025 NextGen English. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Verification email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Gửi email reset password
const sendPasswordResetEmail = async (to, resetToken, userName) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: {
        name: 'NextGen English',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: '🔐 Đặt lại mật khẩu NextGen English',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 NextGen English</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #ff6b6b; margin-top: 0;">Đặt lại mật khẩu</h2>
            
            <p>Chào ${userName},</p>
            
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản NextGen English của bạn. Nhấn vào nút bên dưới để tạo mật khẩu mới.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); 
                        color: white; 
                        padding: 15px 30px; 
                        text-decoration: none; 
                        border-radius: 50px; 
                        font-weight: bold; 
                        display: inline-block;
                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);">
                🔑 Đặt lại mật khẩu
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              <strong>Lưu ý:</strong> Link đặt lại mật khẩu sẽ hết hạn sau 1 giờ. Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.
            </p>
            
            <hr style="border: 1px solid #eee; margin: 20px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
              Nếu bạn gặp khó khăn với nút bên trên, hãy copy và paste link sau vào trình duyệt:<br>
              <a href="${resetUrl}" style="color: #ff6b6b; word-break: break-all;">${resetUrl}</a>
            </p>
            
            <p style="color: #666; font-size: 12px; text-align: center; margin-top: 20px;">
              © 2025 NextGen English. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      `
    };
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset email sent:', result.messageId);
    return { success: true, messageId: result.messageId };
    
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return { success: false, error: error.message };
  }
};

// Test email connection
const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection successful');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error);
    return false;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  testEmailConnection
};