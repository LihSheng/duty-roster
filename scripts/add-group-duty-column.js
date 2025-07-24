const db = require('../database/db');

// Add is_group_duty column to duties table
const addGroupDutyColumn = () => {
  console.log('Checking if is_group_duty column exists in duties table...');

  // Check if the column already exists
  db.all('PRAGMA table_info(duties)', (err, rows) => {
    if (err) {
      console.error('Error checking table schema:', err);
      return;
    }

    // Check if the column exists in the result
    const columnExists =
      rows && Array.isArray(rows) && rows.some((row) => row.name === 'is_group_duty');

    if (columnExists) {
      console.log('is_group_duty column already exists in duties table.');
    } else {
      console.log('Adding is_group_duty column to duties table...');

      // Add the column
      db.run('ALTER TABLE duties ADD COLUMN is_group_duty BOOLEAN DEFAULT 0', (err) => {
        if (err) {
          console.error('Error adding is_group_duty column:', err);
          return;
        }

        console.log('is_group_duty column added successfully.');

        // Update House keeping duty to be a group duty
        db.run('UPDATE duties SET is_group_duty = 1 WHERE name = ?', ['House keeping'], (err) => {
          if (err) {
            console.error('Error updating House keeping duty:', err);
            return;
          }
          console.log('House keeping duty updated to be a group duty.');
        });
      });
    }
  });
};

// Run the function
addGroupDutyColumn();
