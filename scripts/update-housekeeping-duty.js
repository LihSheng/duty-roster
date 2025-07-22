const db = require('../database/db');

// Update the House keeping duty to use the new format
const updateHouseKeepingDuty = () => {
  // Check if the duty already exists
  db.get('SELECT * FROM duties WHERE name = ?', ['House keeping'], (err, duty) => {
    if (err) {
      console.error('Error checking for House keeping duty:', err);
      return;
    }
    
    if (duty) {
      console.log('House keeping duty exists, updating to new format...');
      // Update the existing duty to have monthly frequency with the new format
      db.run(
        'UPDATE duties SET frequency = ?, days_of_week = ? WHERE id = ?',
        ['monthly', JSON.stringify([-1, 5]), duty.id], // -1 = last week, 5 = Friday
        (err) => {
          if (err) {
            console.error('Error updating House keeping duty:', err);
            return;
          }
          console.log('House keeping duty updated successfully to new format');
        }
      );
    } else {
      console.log('House keeping duty not found, creating...');
      // Create the new duty
      db.run(
        'INSERT INTO duties (name, description, frequency, days_of_week) VALUES (?, ?, ?, ?)',
        [
          'House keeping',
          'Monthly house cleaning on the last Friday of each month. All people are involved.',
          'monthly',
          JSON.stringify([-1, 5]) // -1 = last week, 5 = Friday
        ],
        function(err) {
          if (err) {
            console.error('Error creating House keeping duty:', err);
            return;
          }
          console.log('House keeping duty created successfully with ID:', this.lastID);
        }
      );
    }
  });
};

// Run the function
updateHouseKeepingDuty();