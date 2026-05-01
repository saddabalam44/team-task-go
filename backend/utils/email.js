import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s/g, '') : '',
  },
});

export const sendWelcomeEmail = async (email, name, password) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass || emailPass === 'your_gmail_app_password_here') {
    console.error('CRITICAL: Email credentials not properly set in .env file.');
    console.warn('Skipping welcome email for:', email);
    return;
  }

  console.log('Attempting to send welcome email to:', email);

  const mailOptions = {
    from: `"TeamTaskGo" <${emailUser}>`,
    to: email,
    subject: 'Welcome to TeamTaskGo - Your Account Credentials',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #3eb368; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">TeamTaskGo</h1>
        </div>
        <div style="padding: 30px;">
          <h2 style="color: #3eb368;">Welcome to the Team, ${name}!</h2>
          <p>You have been added to the <strong>TeamTaskGo</strong> workspace by your Administrator.</p>
          <p>Below are your login credentials. Please keep them secure:</p>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 12px; margin: 25px 0; border: 1px solid #e3f5ea;">
            <p style="margin: 5px 0;"><strong>Login URL:</strong> <a href="http://localhost:5173" style="color: #3eb368; text-decoration: none; font-weight: bold;">http://localhost:5173</a></p>
            <p style="margin: 5px 0;"><strong>Email:</strong> <span style="color: #555;">${email}</span></p>
            <p style="margin: 5px 0;"><strong>Password:</strong> <span style="color: #555;">${password}</span></p>
          </div>
          <p>We recommend changing your password after your first login for better security.</p>
          <p style="margin-top: 30px;">Best Regards,<br><strong style="color: #3eb368;">The TeamTaskGo Team</strong></p>
        </div>
        <div style="background-color: #f4fbfa; padding: 15px; text-align: center; font-size: 12px; color: #999;">
          © ${new Date().getFullYear()} TeamTaskGo. All rights reserved.
        </div>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Error sending welcome email:');
    console.error('Error Name:', error.name);
    console.error('Error Message:', error.message);
    if (error.code === 'EAUTH') {
      console.error('AUTHENTICATION FAILED: Check your EMAIL_USER and EMAIL_PASS (App Password).');
    }
    throw error;
  }
};
