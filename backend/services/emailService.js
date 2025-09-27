const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    // Only initialize email service if valid credentials are provided
    const emailUser = process.env.EMAIL_USER;
    const emailPass = process.env.EMAIL_PASS;
    
    if (emailUser && emailPass && emailUser.includes('@')) {
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPass
        }
      });
      this.enabled = true;
    } else {
      console.log('Email Service disabled: Invalid or missing email credentials');
      this.transporter = null;
      this.enabled = false;
    }
  }

  async sendEmail(to, subject, html, text = '') {
    try {
      if (!this.enabled) {
        console.log('Email Service disabled - would send:', { to, subject });
        return { success: true, messageId: 'disabled', message: 'Email service disabled' };
      }

      const mailOptions = {
        from: process.env.EMAIL_USER || 'noreply@college.edu',
        to,
        subject,
        html,
        text
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeEmail(user) {
    const subject = 'Welcome to College ERP System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Welcome to College ERP System!</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your account has been successfully created with the following details:</p>
        <ul>
          <li><strong>Name:</strong> ${user.firstName} ${user.lastName}</li>
          <li><strong>Email:</strong> ${user.email}</li>
          <li><strong>Role:</strong> ${user.role}</li>
          ${user.role === 'student' && user.studentInfo ? `
            <li><strong>Student ID:</strong> ${user.studentInfo.studentId}</li>
            <li><strong>Roll Number:</strong> ${user.studentInfo.rollNumber}</li>
          ` : ''}
        </ul>
        <p>Your account is currently pending approval. You will be notified once it's approved.</p>
        <p>Best regards,<br>College Administration</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendApprovalEmail(user, approved = true) {
    const subject = approved ? 'Account Approved - College ERP System' : 'Account Rejected - College ERP System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${approved ? '#10B981' : '#EF4444'};">
          ${approved ? 'Account Approved!' : 'Account Rejected'}
        </h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>Your account has been ${approved ? 'approved' : 'rejected'} by the administrator.</p>
        ${approved ? `
          <p>You can now log in to access your dashboard at: <a href="${process.env.FRONTEND_URL}/login">Login Here</a></p>
        ` : `
          <p>If you have any questions, please contact the administration.</p>
        `}
        <p>Best regards,<br>College Administration</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const subject = 'Password Reset - College ERP System';
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B5CF6;">Password Reset Request</h2>
        <p>Dear ${user.firstName} ${user.lastName},</p>
        <p>You have requested to reset your password. Click the link below to reset it:</p>
        <p><a href="${resetUrl}" style="background-color: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Best regards,<br>College Administration</p>
      </div>
    `;

    return await this.sendEmail(user.email, subject, html);
  }

  async sendFeeReminderEmail(student, feeDetails) {
    const subject = 'Fee Payment Reminder - College ERP System';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #F59E0B;">Fee Payment Reminder</h2>
        <p>Dear ${student.firstName} ${student.lastName},</p>
        <p>This is a reminder that you have pending fee payments:</p>
        <ul>
          <li><strong>Fee Type:</strong> ${feeDetails.feeType}</li>
          <li><strong>Amount:</strong> ₹${feeDetails.amount}</li>
          <li><strong>Due Date:</strong> ${new Date(feeDetails.dueDate).toLocaleDateString()}</li>
        </ul>
        <p>Please make the payment at your earliest convenience to avoid any late fees.</p>
        <p>Best regards,<br>College Administration</p>
      </div>
    `;

    return await this.sendEmail(student.email, subject, html);
  }
}

module.exports = new EmailService();
