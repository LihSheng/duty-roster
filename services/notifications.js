const nodemailer = require('nodemailer');
const axios = require('axios');

class NotificationService {
  constructor() {
    // Email transporter setup
    this.emailTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendEmail(to, subject, text, html) {
    try {
      if (!process.env.SMTP_USER) {
        console.log('Email not configured, skipping email notification');
        return { success: false, message: 'Email not configured' };
      }

      const mailOptions = {
        from: process.env.SMTP_USER,
        to,
        subject,
        text,
        html
      };

      const result = await this.emailTransporter.sendMail(mailOptions);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('Email sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async sendWhatsApp(phone, message) {
    try {
      if (!process.env.WHATSAPP_API_URL || !process.env.WHATSAPP_API_TOKEN) {
        console.log('WhatsApp not configured, skipping WhatsApp notification');
        return { success: false, message: 'WhatsApp not configured' };
      }

      // Using a generic WhatsApp API format - adjust based on your provider
      const response = await axios.post(process.env.WHATSAPP_API_URL, {
        phone: phone,
        message: message
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      return { success: true, data: response.data };
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      return { success: false, error: error.message };
    }
  }

  async notifyAssignment(person, duty, assignedDate) {
    const subject = `New Duty Assignment: ${duty.name}`;
    const message = `Hi ${person.name},\n\nYou have been assigned to: ${duty.name}\nDescription: ${duty.description}\nDue Date: ${assignedDate}\n\nPlease complete this task and mark it as done in the system.\n\nThank you!`;
    
    const htmlMessage = `
      <h2>New Duty Assignment</h2>
      <p>Hi ${person.name},</p>
      <p>You have been assigned to: <strong>${duty.name}</strong></p>
      <p>Description: ${duty.description}</p>
      <p>Due Date: <strong>${assignedDate}</strong></p>
      <p>Please complete this task and mark it as done in the system.</p>
      <p>Thank you!</p>
    `;

    const results = [];

    // Send email if available
    if (person.email) {
      const emailResult = await this.sendEmail(person.email, subject, message, htmlMessage);
      results.push({ type: 'email', ...emailResult });
    }

    // Send WhatsApp if available
    if (person.phone) {
      const whatsappResult = await this.sendWhatsApp(person.phone, message);
      results.push({ type: 'whatsapp', ...whatsappResult });
    }

    return results;
  }

  async notifyOverdue(person, duty, dueDate) {
    const subject = `Overdue Duty Reminder: ${duty.name}`;
    const message = `Hi ${person.name},\n\nThis is a reminder that your duty "${duty.name}" was due on ${dueDate} and is now overdue.\n\nPlease complete this task as soon as possible and mark it as done.\n\nThank you!`;
    
    const htmlMessage = `
      <h2>⚠️ Overdue Duty Reminder</h2>
      <p>Hi ${person.name},</p>
      <p>This is a reminder that your duty "<strong>${duty.name}</strong>" was due on <strong>${dueDate}</strong> and is now overdue.</p>
      <p>Please complete this task as soon as possible and mark it as done.</p>
      <p>Thank you!</p>
    `;

    const results = [];

    if (person.email) {
      const emailResult = await this.sendEmail(person.email, subject, message, htmlMessage);
      results.push({ type: 'email', ...emailResult });
    }

    if (person.phone) {
      const whatsappResult = await this.sendWhatsApp(person.phone, message);
      results.push({ type: 'whatsapp', ...whatsappResult });
    }

    return results;
  }
}

module.exports = new NotificationService();