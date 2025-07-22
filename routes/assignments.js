const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get assignments for a date range
router.get('/', (req, res) => {
  const { start_date, end_date } = req.query;
  
  let query = `
    SELECT a.*, d.name as duty_name, d.description, p.name as person_name, p.email, p.phone
    FROM assignments a
    JOIN duties d ON a.duty_id = d.id
    JOIN people p ON a.person_id = p.id
  `;
  
  let params = [];
  
  if (start_date && end_date) {
    query += ' WHERE a.assigned_date BETWEEN ? AND ?';
    params = [start_date, end_date];
  }
  
  query += ' ORDER BY a.assigned_date, a.due_date';
  
  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create assignment
router.post('/', (req, res) => {
  const { duty_id, person_id, assigned_date, due_date } = req.body;
  
  db.run(
    'INSERT INTO assignments (duty_id, person_id, assigned_date, due_date) VALUES (?, ?, ?, ?)',
    [duty_id, person_id, assigned_date, due_date],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Assignment created successfully' });
    }
  );
});

// Mark assignment as completed
router.put('/:id/complete', (req, res) => {
  const { notes } = req.body;
  
  db.run(
    'UPDATE assignments SET status = "completed", completed_at = CURRENT_TIMESTAMP, notes = ? WHERE id = ?',
    [notes || '', req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Assignment marked as completed' });
    }
  );
});

// Update assignment (drag and drop)
router.put('/:id', (req, res) => {
  const { person_id, assigned_date, due_date } = req.body;
  
  db.run(
    'UPDATE assignments SET person_id = ?, assigned_date = ?, due_date = ? WHERE id = ?',
    [person_id, assigned_date, due_date, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Assignment updated successfully' });
    }
  );
});

// Delete an assignment
router.delete('/:id', (req, res) => {
  db.run('DELETE FROM assignments WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Assignment deleted successfully' });
  });
});

module.exports = router;