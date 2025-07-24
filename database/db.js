const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'duty_roster.db');
const db = new sqlite3.Database(dbPath);

// Initialize database tables
db.serialize(() => {
  // People table
  db.run(`CREATE TABLE IF NOT EXISTS people (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Duties table
  db.run(`CREATE TABLE IF NOT EXISTS duties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    frequency TEXT NOT NULL, -- 'daily', 'weekly', 'custom'
    days_of_week TEXT, -- JSON array for weekly duties
    is_group_duty BOOLEAN DEFAULT 0, -- Indicates if this duty can be assigned to multiple people
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Assignments table
  db.run(`CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    duty_id INTEGER,
    person_id INTEGER,
    assigned_date DATE,
    due_date DATE,
    status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'overdue'
    completed_at DATETIME,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (duty_id) REFERENCES duties (id),
    FOREIGN KEY (person_id) REFERENCES people (id)
  )`);

  // Settings table
  db.run(`CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // No default duties will be created - users will add their own duties
  console.log('Database initialized without default duties');
});

module.exports = db;
