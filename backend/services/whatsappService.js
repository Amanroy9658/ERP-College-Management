class WhatsAppService {
  constructor() {
    this.apiUrl = process.env.WHATSAPP_API_URL || 'https://api.whatsapp.com/send';
    this.phoneNumber = process.env.WHATSAPP_PHONE_NUMBER || '+1234567890';
  }

  generateWhatsAppUrl(phone, message) {
    const encodedMessage = encodeURIComponent(message);
    return `${this.apiUrl}?phone=${phone}&text=${encodedMessage}`;
  }

  async sendMessage(phone, message) {
    try {
      const url = this.generateWhatsAppUrl(phone, message);
      
      // In a real implementation, you would use WhatsApp Business API
      // For now, we'll return the URL that can be opened
      return {
        success: true,
        url: url,
        message: 'WhatsApp message URL generated successfully'
      };
    } catch (error) {
      console.error('WhatsApp message error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendWelcomeMessage(user) {
    const message = `🎉 Welcome to College ERP System!\n\n` +
      `Hello ${user.firstName} ${user.lastName},\n\n` +
      `Your account has been created successfully!\n` +
      `Role: ${user.role}\n` +
      `${user.role === 'student' && user.studentInfo ? `Student ID: ${user.studentInfo.studentId}\n` : ''}` +
      `Your account is currently pending approval.\n\n` +
      `You will be notified once it's approved.\n\n` +
      `Best regards,\nCollege Administration`;

    return await this.sendMessage(user.phone, message);
  }

  async sendApprovalMessage(user, approved = true) {
    const message = approved 
      ? `✅ Account Approved!\n\n` +
        `Hello ${user.firstName} ${user.lastName},\n\n` +
        `Great news! Your College ERP account has been approved.\n\n` +
        `You can now log in to access your dashboard:\n` +
        `${process.env.FRONTEND_URL}/login\n\n` +
        `Best regards,\nCollege Administration`
      : `❌ Account Rejected\n\n` +
        `Hello ${user.firstName} ${user.lastName},\n\n` +
        `Unfortunately, your College ERP account has been rejected.\n\n` +
        `If you have any questions, please contact the administration.\n\n` +
        `Best regards,\nCollege Administration`;

    return await this.sendMessage(user.phone, message);
  }

  async sendFeeReminderMessage(student, feeDetails) {
    const message = `💰 Fee Payment Reminder\n\n` +
      `Hello ${student.firstName} ${student.lastName},\n\n` +
      `This is a reminder about your pending fee payment:\n\n` +
      `Fee Type: ${feeDetails.feeType}\n` +
      `Amount: ₹${feeDetails.amount}\n` +
      `Due Date: ${new Date(feeDetails.dueDate).toLocaleDateString()}\n\n` +
      `Please make the payment at your earliest convenience to avoid any late fees.\n\n` +
      `Best regards,\nCollege Administration`;

    return await this.sendMessage(student.phone, message);
  }

  async sendExamReminderMessage(student, examDetails) {
    const message = `📚 Exam Reminder\n\n` +
      `Hello ${student.firstName} ${student.lastName},\n\n` +
      `This is a reminder about your upcoming exam:\n\n` +
      `Exam: ${examDetails.examName}\n` +
      `Date: ${new Date(examDetails.date).toLocaleDateString()}\n` +
      `Time: ${examDetails.time}\n` +
      `Venue: ${examDetails.venue}\n\n` +
      `Please arrive 15 minutes before the exam time.\n\n` +
      `Best regards,\nCollege Administration`;

    return await this.sendMessage(student.phone, message);
  }

  async sendHostelAllocationMessage(student, hostelDetails) {
    const message = `🏠 Hostel Allocation\n\n` +
      `Hello ${student.firstName} ${student.lastName},\n\n` +
      `Your hostel allocation details:\n\n` +
      `Hostel: ${hostelDetails.hostelName}\n` +
      `Room Number: ${hostelDetails.roomNumber}\n` +
      `Room Type: ${hostelDetails.roomType}\n\n` +
      `Please report to the warden for further instructions.\n\n` +
      `Best regards,\nCollege Administration`;

    return await this.sendMessage(student.phone, message);
  }

  async sendBulkMessage(recipients, message) {
    const results = [];
    
    for (const recipient of recipients) {
      try {
        const result = await this.sendMessage(recipient.phone, message);
        results.push({
          phone: recipient.phone,
          name: recipient.name,
          success: result.success,
          url: result.url
        });
      } catch (error) {
        results.push({
          phone: recipient.phone,
          name: recipient.name,
          success: false,
          error: error.message
        });
      }
    }

    return {
      success: true,
      results: results,
      totalSent: results.filter(r => r.success).length,
      totalFailed: results.filter(r => !r.success).length
    };
  }
}

module.exports = new WhatsAppService();
