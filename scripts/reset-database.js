const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../database/duty_roster.db');
const db = new sqlite3.Database(dbPath);

console.log('🔄 Resetting database...');

db.serialize(() => {
  // Drop all tables
  db.run('DROP TABLE IF EXISTS assignments');
  db.run('DROP TABLE IF EXISTS duties');
  db.run('DROP TABLE IF EXISTS people');
  db.run('DROP TABLE IF EXISTS settings');

  console.log('✓ All tables dropped');

  // Recreate tables (same as in db.js)
  db.run(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS duties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL,
    days_of_week TEXT,
    is_group_duty BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duty_id INTEGER,
    person_id INTEGER,
    assigned_date DATE,
    due_date DATE,
    status TEXT DEFAULT 'pending',
    completed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (duty_id) REFERENCES duties (id),
    FOREIGN KEY (person_id) REFERENCES people (id)
  )`);

  db.run(
    `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`,
    (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err);
      } else {
        console.log('✓ Tables recreated successfully');
        console.log('\n✅ Database reset complete!');
        console.log('💡 Run "npm run seed" to populate with demo data');
      }

      db.close();
    }
  );
});
