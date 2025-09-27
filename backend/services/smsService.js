const twilio = require('twilio');

class SMSService {
  constructor() {
    // Only initialize Twilio if valid credentials are provided
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    
    if (accountSid && authToken && accountSid.startsWith('AC')) {
      this.client = twilio(accountSid, authToken);
      this.fromNumber = process.env.TWILIO_PHONE_NUMBER || '+1234567890';
      this.enabled = true;
    } else {
      console.log('SMS Service disabled: Invalid or missing Twilio credentials');
      this.client = null;
      this.fromNumber = '+1234567890';
      this.enabled = false;
    }
  }

  async sendSMS(to, message) {
    try {
      if (!this.enabled) {
        console.log('SMS Service disabled - would send:', { to, message });
        return { success: true, messageId: 'disabled', message: 'SMS service disabled' };
      }

      const result = await this.client.messages.create({
        body: message,
        from: this.fromNumber,
        to: to
      });

      console.log('SMS sent successfully:', result.sid);
      return { success: true, messageId: result.sid };
    } catch (error) {
      console.error('SMS sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWelcomeSMS(user) {
    const message = `Welcome to College ERP! Your account (${user.role}) is created and pending approval. You'll be notified once approved.`;
    return await this.sendSMS(user.phone, message);
  }

  async sendApprovalSMS(user, approved = true) {
    const message = approved 
      ? `Your College ERP account has been approved! You can now login to access your dashboard.`
      : `Your College ERP account has been rejected. Please contact administration for details.`;
    return await this.sendSMS(user.phone, message);
  }

  async sendFeeReminderSMS(student, feeDetails) {
    const message = `Fee Reminder: ${feeDetails.feeType} of ₹${feeDetails.amount} is due on ${new Date(feeDetails.dueDate).toLocaleDateString()}. Please pay to avoid late fees.`;
    return await this.sendSMS(student.phone, message);
  }

  async sendExamReminderSMS(student, examDetails) {
    const message = `Exam Reminder: ${examDetails.examName} is scheduled on ${new Date(examDetails.date).toLocaleDateString()} at ${examDetails.time}. Venue: ${examDetails.venue}`;
    return await this.sendSMS(student.phone, message);
  }

  async sendHostelAllocationSMS(student, hostelDetails) {
    const message = `Hostel Allocation: You have been allocated Room ${hostelDetails.roomNumber} in ${hostelDetails.hostelName}. Please report to the warden.`;
    return await this.sendSMS(student.phone, message);
  }
}

module.exports = new SMSService();
