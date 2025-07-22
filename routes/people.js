const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Get all people
router.get('/', (req, res) => {
  db.all('SELECT * FROM people WHERE is_active = 1', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Create new person
router.post('/', (req, res) => {
  const { name, email, phone } = req.body;
  
  db.run(
    'INSERT INTO people (name, email, phone) VALUES (?, ?, ?)',
    [name, email, phone],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: this.lastID, message: 'Person added successfully' });
    }
  );
});

// Update person
router.put('/:id', (req, res) => {
  const { name, email, phone } = req.body;
  
  db.run(
    'UPDATE people SET name = ?, email = ?, phone = ? WHERE id = ?',
    [name, email, phone, req.params.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: 'Person updated successfully' });
    }
  );
});

// Delete person (soft delete)
router.delete('/:id', (req, res) => {
  db.run('UPDATE people SET is_active = 0 WHERE id = ?', [req.params.id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Person removed successfully' });
  });
});

module.exports = router;