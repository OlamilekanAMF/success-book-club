const nodemailer = require('nodemailer');
const config = require('../config/auth');

// Create transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass
  }
});

// Email templates
const templates = {
  welcome: (data) => ({
    subject: data.subject || 'Welcome to Triumphant Book Club!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #8B5CF6, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Triumphant Book Club!</h1>
          </div>
          <div class="content">
            <h2>Hi ${data.name || 'Reader'}!</h2>
            <p>Welcome to our community of passionate readers who celebrate stories of triumph, resilience, and the human spirit.</p>
            <p>Here's what you can do as a free member:</p>
            <ul>
              <li>Participate in community discussions</li>
              <li>Join our live chat rooms</li>
              <li>Vote in polls</li>
              <li>Track your reading challenges</li>
              <li>Suggest books for the community</li>
            </ul>
            <p>Ready to start your journey?</p>
            <a href="${config.frontend.url}/community.html" class="btn">Explore Community</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Triumphant Book Club. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  'password-reset': (data) => ({
    subject: data.subject || 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #8B5CF6; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .btn { display: inline-block; padding: 12px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Reset Your Password</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name || 'Reader'}!</p>
            <p>You requested to reset your password. Click the button below to create a new password:</p>
            <a href="${data.resetUrl}" class="btn">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Triumphant Book Club. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  premium: (data) => ({
    subject: data.subject || 'Welcome to Premium!',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #F59E0B, #EC4899); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .features { background: white; padding: 20px; border-radius: 5px; margin: 20px 0; }
          .features li { margin: 10px 0; }
          .btn { display: inline-block; padding: 12px 30px; background: #F59E0B; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're Now Premium!</h1>
          </div>
          <div class="content">
            <p>Hi ${data.name || 'Reader'}!</p>
            <p>Thank you for upgrading to Premium! You now have access to exclusive features:</p>
            <div class="features">
              <ul>
                <li>👤 Priority access to Author Q&A sessions</li>
                <li>📚 Exclusive premium-only book library</li>
                <li>🎫 Early event registration</li>
                <li>📥 Download premium resources</li>
                <li>🚀 Ad-free experience</li>
              </ul>
            </div>
            <a href="${config.frontend.url}/community.html" class="btn">Explore Premium Features</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Triumphant Book Club. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

const sendEmail = async (to, type, data) => {
  // Check if email is configured
  if (!config.email.user || !config.email.pass) {
    console.log(`[Email Mock] Would send ${type} to ${to}:`, data.subject || type);
    return { mock: true };
  }

  try {
    const template = templates[type] || templates.welcome;
    const { subject, html } = template(data);

    const info = await transporter.sendMail({
      from: '"Triumphant Book Club" <noreply@triumphantbookclub.com>',
      to,
      subject,
      html
    });

    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

module.exports = { sendEmail };
