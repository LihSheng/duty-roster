const express = require('express');
const router = express.Router();
const db = require('../database/db');
const notificationService = require('../services/notifications');

// Send notification for specific assignment
router.post('/assignment/:id', async (req, res) => {
  const assignmentId = req.params.id;

  const query = `
    SELECT a.*, d.name as duty_name, d.description, p.name as person_name, p.email, p.phone
    FROM assignments a
    JOIN duties d ON a.duty_id = d.id
    JOIN people p ON a.person_id = p.id
    WHERE a.id = ?
  `;

  db.get(query, [assignmentId], async (err, assignment) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    if (!assignment) {
      res.status(404).json({ error: 'Assignment not found' });
      return;
    }

    const person = {
      name: assignment.person_name,
      email: assignment.email,
      phone: assignment.phone,
    };

    const duty = {
      name: assignment.duty_name,
      description: assignment.description,
    };

    try {
      const results = await notificationService.notifyAssignment(
        person,
        duty,
        assignment.assigned_date
      );
      res.json({ message: 'Notifications sent', results });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Send overdue notifications
router.post('/overdue', async (req, res) => {
  const query = `
    SELECT a.*, d.name as duty_name, d.description, p.name as person_name, p.email, p.phone
    FROM assignments a
    JOIN duties d ON a.duty_id = d.id
    JOIN people p ON a.person_id = p.id
    WHERE a.status = 'pending' AND a.due_date < date('now')
  `;

  db.all(query, async (err, assignments) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const results = [];

    for (const assignment of assignments) {
      const person = {
        name: assignment.person_name,
        email: assignment.email,
        phone: assignment.phone,
      };

      const duty = {
        name: assignment.duty_name,
        description: assignment.description,
      };

      try {
        const notificationResults = await notificationService.notifyOverdue(
          person,
          duty,
          assignment.due_date
        );
        results.push({
          assignmentId: assignment.id,
          person: assignment.person_name,
          duty: assignment.duty_name,
          notifications: notificationResults,
        });
      } catch (error) {
        results.push({
          assignmentId: assignment.id,
          person: assignment.person_name,
          duty: assignment.duty_name,
          error: error.message,
        });
      }
    }

    res.json({ message: `Processed ${assignments.length} overdue assignments`, results });
  });
});

module.exports = router;
