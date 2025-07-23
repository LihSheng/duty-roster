const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/duty_roster.db');
const db = new sqlite3.Database(dbPath);

// Sample data
const samplePeople = [
  { name: 'Alice Johnson', email: 'alice@example.com', phone: '+1-555-0101' },
  { name: 'Bob Smith', email: 'bob@example.com', phone: '+1-555-0102' },
  { name: 'Carol Davis', email: 'carol@example.com', phone: '+1-555-0103' },
  { name: 'David Wilson', email: 'david@example.com', phone: '+1-555-0104' },
  { name: 'Emma Brown', email: 'emma@example.com', phone: '+1-555-0105' },
  { name: 'Frank Miller', email: 'frank@example.com', phone: '+1-555-0106' }
];

const sampleDuties = [
  {
    name: 'Kitchen Cleaning',
    description: 'Clean kitchen counters, sink, stove, and sweep floor',
    frequency: 'daily',
    days_of_week: null,
    is_group_duty: 0
  },
  {
    name: 'Bathroom Cleaning',
    description: 'Clean toilet, sink, mirror, and mop floor',
    frequency: 'weekly',
    days_of_week: JSON.stringify([1]), // Monday
    is_group_duty: 0
  },
  {
    name: 'Living Room Tidying',
    description: 'Vacuum carpet, dust surfaces, organize items',
    frequency: 'weekly',
    days_of_week: JSON.stringify([3, 6]), // Wednesday and Saturday
    is_group_duty: 0
  },
  {
    name: 'Trash & Recycling',
    description: 'Empty all trash bins and take out recycling',
    frequency: 'weekly',
    days_of_week: JSON.stringify([2, 5]), // Tuesday and Friday
    is_group_duty: 0
  },
  {
    name: 'Laundry Room',
    description: 'Clean washing machine, dryer, and fold area',
    frequency: 'weekly',
    days_of_week: JSON.stringify([0]), // Sunday
    is_group_duty: 0
  },
  {
    name: 'Garden Maintenance',
    description: 'Water plants, weed garden beds, general upkeep',
    frequency: 'weekly',
    days_of_week: JSON.stringify([6]), // Saturday
    is_group_duty: 0
  },
  {
    name: 'Deep Clean Kitchen',
    description: 'Monthly deep cleaning of kitchen appliances and cabinets',
    frequency: 'custom',
    days_of_week: null,
    is_group_duty: 1
  },
  {
    name: 'Grocery Shopping',
    description: 'Weekly grocery shopping for household items',
    frequency: 'weekly',
    days_of_week: JSON.stringify([0]), // Sunday
    is_group_duty: 0
  }
];

const sampleSettings = [
  { key: 'notification_enabled', value: 'true' },
  { key: 'reminder_days', value: '1' },
  { key: 'default_due_time', value: '18:00' },
  { key: 'house_name', value: 'Demo House' }
];

// Helper function to get random date within range
function getRandomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

// Helper function to add days to date
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Clear existing data
function clearDatabase() {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      db.run("DELETE FROM assignments");
      db.run("DELETE FROM duties");
      db.run("DELETE FROM people");
      db.run("DELETE FROM settings", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

// Insert people
function insertPeople() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO people (name, email, phone) VALUES (?, ?, ?)");
    
    samplePeople.forEach((person, index) => {
      stmt.run(person.name, person.email, person.phone, (err) => {
        if (err) console.error('Error inserting person:', err);
      });
    });
    
    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(`✓ Inserted ${samplePeople.length} people`);
        resolve();
      }
    });
  });
}

// Insert duties
function insertDuties() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO duties (name, description, frequency, days_of_week, is_group_duty) VALUES (?, ?, ?, ?, ?)");
    
    sampleDuties.forEach((duty) => {
      stmt.run(duty.name, duty.description, duty.frequency, duty.days_of_week, duty.is_group_duty, (err) => {
        if (err) console.error('Error inserting duty:', err);
      });
    });
    
    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(`✓ Inserted ${sampleDuties.length} duties`);
        resolve();
      }
    });
  });
}

// Insert settings
function insertSettings() {
  return new Promise((resolve, reject) => {
    const stmt = db.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
    
    sampleSettings.forEach((setting) => {
      stmt.run(setting.key, setting.value, (err) => {
        if (err) console.error('Error inserting setting:', err);
      });
    });
    
    stmt.finalize((err) => {
      if (err) reject(err);
      else {
        console.log(`✓ Inserted ${sampleSettings.length} settings`);
        resolve();
      }
    });
  });
}

// Create sample assignments for the past week and next two weeks
function createAssignments() {
  return new Promise((resolve, reject) => {
    // Get all people and duties first
    db.all("SELECT * FROM people", (err, people) => {
      if (err) {
        reject(err);
        return;
      }
      
      db.all("SELECT * FROM duties", (err, duties) => {
        if (err) {
          reject(err);
          return;
        }
        
        const stmt = db.prepare(`
          INSERT INTO assignments (duty_id, person_id, assigned_date, due_date, status, completed_at, notes) 
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        
        const today = new Date();
        const startDate = addDays(today, -7); // Start from a week ago
        const endDate = addDays(today, 14); // Go two weeks into future
        
        let assignmentCount = 0;
        
        // Create assignments for each day in the range
        for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
          const dayOfWeek = date.getDay();
          
          duties.forEach((duty) => {
            let shouldAssign = false;
            
            if (duty.frequency === 'daily') {
              shouldAssign = true;
            } else if (duty.frequency === 'weekly' && duty.days_of_week) {
              const assignedDays = JSON.parse(duty.days_of_week);
              shouldAssign = assignedDays.includes(dayOfWeek);
            } else if (duty.frequency === 'custom') {
              // Assign custom duties randomly (about once a week)
              shouldAssign = Math.random() < 0.14; // ~1/7 chance per day
            }
            
            if (shouldAssign) {
              // Randomly assign to a person
              const randomPerson = people[Math.floor(Math.random() * people.length)];
              const assignedDate = new Date(date);
              const dueDate = new Date(date);
              dueDate.setHours(18, 0, 0, 0); // Due at 6 PM
              
              // Determine status based on date
              let status = 'pending';
              let completedAt = null;
              let notes = null;
              
              if (date < today) {
                // Past assignments - randomly complete some
                if (Math.random() < 0.8) { // 80% completion rate
                  status = 'completed';
                  completedAt = new Date(dueDate.getTime() + Math.random() * 2 * 60 * 60 * 1000); // Completed within 2 hours of due time
                  if (Math.random() < 0.3) { // 30% chance of having notes
                    const noteOptions = [
                      'Completed thoroughly',
                      'Extra cleaning needed',
                      'Found some issues, addressed them',
                      'Quick clean, all good',
                      'Took longer than expected'
                    ];
                    notes = noteOptions[Math.floor(Math.random() * noteOptions.length)];
                  }
                } else if (Math.random() < 0.5) { // Some incomplete tasks become overdue
                  status = 'overdue';
                }
              }
              
              stmt.run(
                duty.id,
                randomPerson.id,
                assignedDate.toISOString().split('T')[0],
                dueDate.toISOString().split('T')[0],
                status,
                completedAt ? completedAt.toISOString() : null,
                notes,
                (err) => {
                  if (err) console.error('Error inserting assignment:', err);
                }
              );
              
              assignmentCount++;
            }
          });
        }
        
        stmt.finalize((err) => {
          if (err) reject(err);
          else {
            console.log(`✓ Created ${assignmentCount} assignments`);
            resolve();
          }
        });
      });
    });
  });
}

// Main seeding function
async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');
    
    console.log('🗑️  Clearing existing data...');
    await clearDatabase();
    
    console.log('👥 Inserting people...');
    await insertPeople();
    
    console.log('🧹 Inserting duties...');
    await insertDuties();
    
    console.log('⚙️  Inserting settings...');
    await insertSettings();
    
    console.log('📋 Creating assignments...');
    await createAssignments();
    
    console.log('\n✅ Database seeding completed successfully!');
    console.log('\nDemo data includes:');
    console.log(`• ${samplePeople.length} people`);
    console.log(`• ${sampleDuties.length} duties (daily, weekly, and custom)`);
    console.log('• Assignments for the past week and next 2 weeks');
    console.log('• Mix of completed, pending, and overdue tasks');
    console.log('• Realistic household cleaning duties');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('\n📦 Database connection closed.');
      }
    });
  }
}

// Run the seeder
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };