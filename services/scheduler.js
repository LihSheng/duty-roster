const cron = require('node-cron');
const axios = require('axios');
const db = require('../database/db');
const notificationService = require('./notifications');

class SchedulerService {
  constructor() {
    // Schedule daily check for overdue duties at midnight
    this.overdueJob = cron.schedule('0 0 * * *', () => {
      this.checkOverdueDuties();
    });
    
    // Schedule daily check for upcoming duties at 8 AM
    this.reminderJob = cron.schedule('0 8 * * *', () => {
      this.sendReminders();
    });
  }
  
  async checkOverdueDuties() {
    console.log('Running overdue duties check...');
    
    try {
      // Get all overdue assignments
      const query = `
        SELECT a.*, d.name as duty_name, d.description, p.name as person_name, p.email, p.phone
        FROM assignments a
        JOIN duties d ON a.duty_id = d.id
        JOIN people p ON a.person_id = p.id
        WHERE a.status = 'pending' AND a.due_date < date('now')
      `;
      
      db.all(query, async (err, assignments) => {
        if (err) {
          console.error('Error checking overdue duties:', err);
          return;
        }
        
        console.log(`Found ${assignments.length} overdue assignments`);
        
        // Update status to overdue
        const updateStmt = db.prepare('UPDATE assignments SET status = "overdue" WHERE id = ?');
        
        for (const assignment of assignments) {
          updateStmt.run([assignment.id]);
          
          // Send notification
          const person = {
            name: assignment.person_name,
            email: assignment.email,
            phone: assignment.phone
          };
          
          const duty = {
            name: assignment.duty_name,
            description: assignment.description
          };
          
          try {
            await notificationService.notifyOverdue(person, duty, assignment.due_date);
          } catch (error) {
            console.error(`Error sending overdue notification for assignment ${assignment.id}:`, error);
          }
        }
        
        updateStmt.finalize();
      });
    } catch (error) {
      console.error('Error in overdue duties check:', error);
    }
  }
  
  async sendReminders() {
    console.log('Sending duty reminders...');
    
    try {
      // Get settings
      db.get('SELECT value FROM settings WHERE key = "reminder_days"', async (err, setting) => {
        if (err) {
          console.error('Error getting reminder settings:', err);
          return;
        }
        
        let reminderDays = 1; // Default to 1 day
        
        if (setting && setting.value) {
          try {
            reminderDays = JSON.parse(setting.value);
          } catch (e) {
            console.error('Error parsing reminder_days setting:', e);
          }
        }
        
        // Get assignments due in X days
        const reminderDate = new Date();
        reminderDate.setDate(reminderDate.getDate() + reminderDays);
        const reminderDateStr = reminderDate.toISOString().split('T')[0];
        
        const query = `
          SELECT a.*, d.name as duty_name, d.description, p.name as person_name, p.email, p.phone
          FROM assignments a
          JOIN duties d ON a.duty_id = d.id
          JOIN people p ON a.person_id = p.id
          WHERE a.status = 'pending' AND a.due_date = ?
        `;
        
        db.all(query, [reminderDateStr], async (err, assignments) => {
          if (err) {
            console.error('Error getting upcoming assignments:', err);
            return;
          }
          
          console.log(`Found ${assignments.length} assignments due in ${reminderDays} days`);
          
          for (const assignment of assignments) {
            const person = {
              name: assignment.person_name,
              email: assignment.email,
              phone: assignment.phone
            };
            
            const duty = {
              name: assignment.duty_name,
              description: assignment.description
            };
            
            try {
              await notificationService.notifyAssignment(person, duty, assignment.due_date);
            } catch (error) {
              console.error(`Error sending reminder for assignment ${assignment.id}:`, error);
            }
          }
        });
      });
    } catch (error) {
      console.error('Error in sending reminders:', error);
    }
  }
  
  // Method to manually check for overdue duties
  manualCheckOverdue() {
    return this.checkOverdueDuties();
  }
  
  // Method to manually send reminders
  manualSendReminders() {
    return this.sendReminders();
  }
}

module.exports = new SchedulerService();