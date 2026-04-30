import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendWelcomeEmail = async (email, name, password) => {
  if (!process.env.EMAIL_USER || process.env.EMAIL_PASS === 'your_gmail_app_password_here' || !process.env.EMAIL_PASS) {
    console.warn('Email credentials not set. Skipping welcome email for:', email);
    return;
  }

  const mailOptions = {
    from: `"TeamTaskGo" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to TeamTaskGo - Your Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #3eb368;">Welcome to the Team, ${name}!</h2>
        <p>You have been added to the <strong>TeamTaskGo</strong> workspace by your Administrator.</p>
        <p>Below are your login credentials. Please keep them secure:</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Login URL:</strong> <a href="http://localhost:5173">http://localhost:5173</a></p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${password}</p>
        </div>
        <p>We recommend changing your password after your first login.</p>
        <p>Best Regards,<br>The TeamTaskGo Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', email);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};
