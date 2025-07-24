const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all duties
router.get('/', (req, res) => {
  db.all('SELECT * FROM duties WHERE is_active = 1', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new duty
router.post('/', (req, res) => {
  const { name, description, frequency, days_of_week, is_group_duty } = req.body;

  db.run(
    'INSERT INTO duties (name, description, frequency, days_of_week, is_group_duty) VALUES (?, ?, ?, ?, ?)',
    [name, description, frequency, JSON.stringify(days_of_week || []), is_group_duty ? 1 : 0],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Duty created successfully' });
    }
  );
});

// Update duty
router.put('/:id', (req, res) => {
  const { name, description, frequency, days_of_week, is_group_duty } = req.body;

  db.run(
    'UPDATE duties SET name = ?, description = ?, frequency = ?, days_of_week = ?, is_group_duty = ? WHERE id = ?',
    [
      name,
      description,
      frequency,
      JSON.stringify(days_of_week || []),
      is_group_duty ? 1 : 0,
      req.params.id,
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Duty updated successfully' });
    }
  );
});

// Delete duty
router.delete('/:id', (req, res) => {
  db.run('UPDATE duties SET is_active = 0 WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Duty deleted successfully' });
  });
});

module.exports = router;
