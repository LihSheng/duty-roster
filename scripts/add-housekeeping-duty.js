const db = require('../database/db');

// Add the House keeping duty
const addHouseKeepingDuty = () => {
  // Check if the duty already exists
  db.get('SELECT * FROM duties WHERE name = ?', ['House keeping'], (err, duty) => {
    if (err) {
      console.error('Error checking for House keeping duty:', err);
      return;
    }
    
    if (duty) {
      console.log('House keeping duty already exists, updating frequency...');
      // Update the existing duty to have monthly frequency
      db.run(
        'UPDATE duties SET frequency = ?, description = ? WHERE id = ?',
        ['monthly', 'Monthly house cleaning on the last Friday of each month. All people are involved.', duty.id],
        (err) => {
          if (err) {
            console.error('Error updating House keeping duty:', err);
            return;
          }
          console.log('House keeping duty updated successfully');
        }
      );
    } else {
      console.log('Creating new House keeping duty...');
      // Create the new duty
      db.run(
        'INSERT INTO duties (name, description, frequency, days_of_week) VALUES (?, ?, ?, ?)',
        [
          'House keeping',
          'Monthly house cleaning on the last Friday of each month. All people are involved.',
          'monthly',
          '[]'
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
addHouseKeepingDuty();