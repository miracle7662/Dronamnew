const nodemailer = require('nodemailer');

// Create Gmail transporter with your credentials
const createGmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'jamadarvasim88@gmail.com',
      pass: 'scub xvkw ptti nrkb', // App password
    },
  });
};

// Create a test account for development (fallback)
const createTestAccount = async () => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error('Error creating test account:', error);
    return null;
  }
};

const sendWelcomeEmail = async (agentEmail, agentName, password) => {
  try {
    console.log('📧 Starting email send process...');
    console.log('📬 To:', agentEmail);
    console.log('👤 Agent Name:', agentName);
    
    // Use Gmail transporter
    const transporter = createGmailTransporter();
    
    if (!transporter) {
      console.error('❌ Failed to create email transporter');
      return false;
    }
    
    console.log('✅ Email transporter created successfully');

    const mailOptions = {
      from: '"Miracle Infotech" <jamadarvasim88@gmail.com>',
      to: agentEmail,
      subject: 'Welcome to Miracle Infotech Reseller Program - Lodging Management',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <h2 style="color: #007bff; margin-bottom: 10px;">Welcome to Miracle Infotech Reseller Program</h2>
            <p style="color: #6c757d; margin-bottom: 15px;">Lodging Management System</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 10px;">
            <h3 style="color: #28a745; margin-bottom: 15px;">Hello ${agentName},</h3>
            
            <p style="line-height: 1.6; margin-bottom: 15px;">
              Welcome to the Miracle Infotech Reseller Program! Your account has been successfully created in our Lodging Management System.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              Here are your login credentials:
            </p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
              <p style="margin: 5px 0;"><strong>Username:</strong> ${agentEmail}</p>
              <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
            </div>
            
            <p style="line-height: 1.6; margin-bottom: 15px;">
              Please keep these credentials secure and do not share them with anyone.
            </p>
            
            <p style="line-height: 1.6; margin-bottom: 20px;">
              You can now access the system and start managing your lodging operations.
            </p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #6c757d; font-size: 14px;">
                If you have any questions, please contact our support team.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 5px;">
            <p style="color: #6c757d; font-size: 12px; margin: 0;">
              © 2024 Miracle Infotech. All rights reserved.
            </p>
          </div>
        </div>
      `,
    };

    console.log('📤 Attempting to send email...');
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Welcome email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('📬 To:', agentEmail);
    console.log('📤 From: jamadarvasim88@gmail.com');
    
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    console.error('❌ Error details:', error.message);
    console.error('❌ Error code:', error.code);
    return false;
  }
};

module.exports = {
  sendWelcomeEmail
}; 