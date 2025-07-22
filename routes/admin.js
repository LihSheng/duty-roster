const express = require('express');
const router = express.Router();
const db = require('../database/db');
const cron = require('node-cron');

// Helper function to check if a date is the last Friday of the month
function isLastFridayOfMonth(date) {
  // Check if it's a Friday (5)
  if (date.getDay() !== 5) {
    return false;
  }
  
  // Get the last day of the month
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  // If this is the last Friday, then there should be no more Fridays in the month
  const daysUntilEndOfMonth = lastDay.getDate() - date.getDate();
  
  // If there are less than 7 days until the end of the month, and it's a Friday,
  // then it's the last Friday of the month
  return daysUntilEndOfMonth < 7;
}

// Helper function to check if a date is a specific day of the month (e.g., first Monday)
function isSpecificDayOfMonth(date, week, day) {
  // Check if it's the right day of the week
  if (date.getDay() !== day) {
    return false;
  }
  
  // Calculate which week of the month this is
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const dayOffset = (day - firstDayOfMonth.getDay() + 7) % 7;
  const firstOccurrence = dayOffset + 1;
  const weekNumber = Math.ceil((date.getDate() - firstOccurrence + 1) / 7);
  
  return weekNumber === week;
}

// Helper function to check if a date is the last occurrence of a specific day in the month
function isLastDayOfTypeInMonth(date, day) {
  if (date.getDay() !== day) {
    return false;
  }
  
  // Check if there are no more occurrences of this day in the month
  const testDate = new Date(date);
  testDate.setDate(date.getDate() + 7);
  
  return testDate.getMonth() !== date.getMonth();
}

// Helper function to check if a date is a working day
function isWorkingDay(date, workingDays = [1, 2, 3, 4, 5]) {
  return workingDays.includes(date.getDay());
}

// Helper function to get the last working day before a date
function getLastWorkingDay(date, workingDays = [1, 2, 3, 4, 5]) {
  const result = new Date(date);
  
  while (!isWorkingDay(result, workingDays)) {
    result.setDate(result.getDate() - 1);
  }
  
  return result;
}

// Generate assignments for a week
router.post('/generate-assignments', (req, res) => {
  const { start_date } = req.body;
  
  // Get all active duties and people
  db.all('SELECT * FROM duties WHERE is_active = 1', (err, duties) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    db.all('SELECT * FROM people WHERE is_active = 1', (err, people) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      
      if (people.length === 0) {
        res.status(400).json({ error: 'No active people found' });
        return;
      }
      
      const startDate = new Date(start_date);
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      // First, check for existing assignments in the date range
      db.all(
        'SELECT duty_id, assigned_date FROM assignments WHERE assigned_date BETWEEN ? AND ?',
        [startDateStr, endDateStr],
        (err, existingAssignments) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          
          // Create a map of existing assignments to avoid duplicates
          const existingMap = {};
          existingAssignments.forEach(assignment => {
            const key = `${assignment.duty_id}-${assignment.assigned_date}`;
            existingMap[key] = true;
          });
          
          const assignments = [];
          
          duties.forEach(duty => {
            let daysOfWeek = [];
            try {
              // Try to parse the days_of_week as JSON
              daysOfWeek = JSON.parse(duty.days_of_week || '[]');
            } catch (error) {
              console.error('Error parsing days_of_week:', error);
              // If it's already an array, use it directly
              if (Array.isArray(duty.days_of_week)) {
                daysOfWeek = duty.days_of_week;
              }
            }
            
            if (duty.frequency === 'daily') {
              // Assign daily duties for 7 days
              for (let i = 0; i < 7; i++) {
                const assignDate = new Date(startDate);
                assignDate.setDate(startDate.getDate() + i);
                const dateStr = assignDate.toISOString().split('T')[0];
                
                // Check if this duty is already assigned for this date
                const key = `${duty.id}-${dateStr}`;
                if (existingMap[key]) {
                  continue; // Skip if already exists
                }
                
                const personIndex = i % people.length;
                assignments.push({
                  duty_id: duty.id,
                  person_id: people[personIndex].id,
                  assigned_date: dateStr,
                  due_date: dateStr
                });
              }
            } else if (duty.frequency === 'working_days') {
              // Assign duties only on working days
              const workingDays = daysOfWeek.length > 0 ? daysOfWeek : [1, 2, 3, 4, 5]; // Default to Mon-Fri
              
              for (let i = 0; i < 7; i++) {
                const assignDate = new Date(startDate);
                assignDate.setDate(startDate.getDate() + i);
                const dayOfWeek = assignDate.getDay();
                const dateStr = assignDate.toISOString().split('T')[0];
                
                if (workingDays.includes(dayOfWeek)) {
                  // Check if this duty is already assigned for this date
                  const key = `${duty.id}-${dateStr}`;
                  if (existingMap[key]) {
                    continue; // Skip if already exists
                  }
                  
                  const personIndex = i % people.length;
                  assignments.push({
                    duty_id: duty.id,
                    person_id: people[personIndex].id,
                    assigned_date: dateStr,
                    due_date: dateStr
                  });
                }
              }
            } else if (duty.frequency === 'weekly' && daysOfWeek.length > 0) {
              // Assign weekly duties on specific days
              let personIndex = 0;
              for (let i = 0; i < 7; i++) {
                const assignDate = new Date(startDate);
                assignDate.setDate(startDate.getDate() + i);
                const dayOfWeek = assignDate.getDay();
                const dateStr = assignDate.toISOString().split('T')[0];
                
                if (daysOfWeek.includes(dayOfWeek)) {
                  // Check if this duty is already assigned for this date
                  const key = `${duty.id}-${dateStr}`;
                  if (existingMap[key]) {
                    continue; // Skip if already exists
                  }
                  
                  assignments.push({
                    duty_id: duty.id,
                    person_id: people[personIndex % people.length].id,
                    assigned_date: dateStr,
                    due_date: dateStr
                  });
                  personIndex++;
                }
              }
            } else if (duty.frequency === 'monthly') {
              // Handle different monthly patterns
              for (let i = 0; i < 7; i++) {
                const currentDate = new Date(startDate);
                currentDate.setDate(startDate.getDate() + i);
                let assignDate = currentDate;
                let shouldAssign = false;
                
                // Check if daysOfWeek is an array with at least 2 elements
                if (Array.isArray(daysOfWeek) && daysOfWeek.length >= 2) {
                  const [week, day] = daysOfWeek;
                  
                  if (week === -1) {
                    // Last occurrence of the day in the month
                    shouldAssign = isLastDayOfTypeInMonth(currentDate, day);
                  } else {
                    // Specific week and day
                    shouldAssign = isSpecificDayOfMonth(currentDate, week, day);
                  }
                  
                  // If the day falls on a non-working day, use the last working day
                  if (shouldAssign && !isWorkingDay(currentDate)) {
                    assignDate = getLastWorkingDay(currentDate);
                    // If the last working day is outside our week range, skip
                    if (assignDate < startDate || assignDate > endDate) {
                      shouldAssign = false;
                    }
                  }
                } else if (duty.name === 'House keeping') {
                  // Legacy support for House keeping duty
                  shouldAssign = isLastFridayOfMonth(currentDate);
                }
                
                if (shouldAssign) {
                  const dateStr = assignDate.toISOString().split('T')[0];
                  
                  // Check if this duty is already assigned for this date
                  const key = `${duty.id}-${dateStr}`;
                  if (existingMap[key]) {
                    continue; // Skip if already exists
                  }
                  
                  // For House keeping, assign to all people
                  if (duty.name === 'House keeping') {
                    people.forEach(person => {
                      assignments.push({
                        duty_id: duty.id,
                        person_id: person.id,
                        assigned_date: dateStr,
                        due_date: dateStr
                      });
                    });
                  } else {
                    // For other monthly duties, rotate among people
                    const monthIndex = currentDate.getMonth();
                    const personIndex = monthIndex % people.length;
                    
                    assignments.push({
                      duty_id: duty.id,
                      person_id: people[personIndex].id,
                      assigned_date: dateStr,
                      due_date: dateStr
                    });
                  }
                }
              }
            }
          });
          
          if (assignments.length === 0) {
            res.json({ message: 'No new assignments needed', count: 0 });
            return;
          }
          
          // Insert new assignments
          const stmt = db.prepare('INSERT INTO assignments (duty_id, person_id, assigned_date, due_date) VALUES (?, ?, ?, ?)');
          
          assignments.forEach(assignment => {
            stmt.run([assignment.duty_id, assignment.person_id, assignment.assigned_date, assignment.due_date]);
          });
          
          stmt.finalize();
          res.json({ message: `Generated ${assignments.length} assignments`, count: assignments.length });
        }
      );
    });
  });
});

// Get overdue assignments
router.get('/overdue', (req, res) => {
  const query = `
    SELECT a.*, d.name as duty_name, p.name as person_name, p.email, p.phone
    FROM assignments a
    JOIN duties d ON a.duty_id = d.id
    JOIN people p ON a.person_id = p.id
    WHERE a.status = 'pending' AND a.due_date < date('now')
    ORDER BY a.due_date
  `;
  
  db.all(query, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Settings endpoints
router.get('/settings', (req, res) => {
  db.all('SELECT * FROM settings', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    
    res.json(settings);
  });
});

router.post('/settings', (req, res) => {
  const settings = req.body;
  
  const stmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
  
  Object.entries(settings).forEach(([key, value]) => {
    stmt.run([key, JSON.stringify(value)]);
  });
  
  stmt.finalize();
  res.json({ message: 'Settings updated successfully' });
});

// Reset assignments for a date range
router.delete('/reset-assignments', (req, res) => {
  const { start_date, end_date } = req.query;
  
  if (!start_date || !end_date) {
    res.status(400).json({ error: 'Start date and end date are required' });
    return;
  }
  
  db.run(
    'DELETE FROM assignments WHERE assigned_date BETWEEN ? AND ?',
    [start_date, end_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        message: 'Assignments reset successfully', 
        count: this.changes 
      });
    }
  );
});

module.exports = router;