import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AdminPanel = () => {
  const [overdueDuties, setOverdueDuties] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  
  useEffect(() => {
    // Set default start date to next Monday
    const today = new Date();
    const nextMonday = new Date(today);
    const daysUntilMonday = (1 + 7 - today.getDay()) % 7;
    nextMonday.setDate(today.getDate() + (daysUntilMonday || 7));
    setStartDate(nextMonday.toISOString().split('T')[0]);
    
    fetchOverdueDuties();
  }, []);
  
  const fetchOverdueDuties = async () => {
    try {
      const res = await axios.get('/api/admin/overdue');
      setOverdueDuties(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching overdue duties:', error);
      setLoading(false);
      toast.error('Failed to load overdue duties');
    }
  };
  
  const generateAssignments = async () => {
    if (!startDate) {
      toast.error('Please select a start date');
      return;
    }
    
    setGenerating(true);
    
    try {
      const res = await axios.post('/api/admin/generate-assignments', {
        start_date: startDate
      });
      
      toast.success(`Generated ${res.data.count} assignments`);
      setGenerating(false);
    } catch (error) {
      console.error('Error generating assignments:', error);
      toast.error(error.response?.data?.error || 'Failed to generate assignments');
      setGenerating(false);
    }
  };
  
  const sendNotifications = async (assignmentId) => {
    try {
      await axios.post(`/api/notifications/assignment/${assignmentId}`);
      toast.success('Notification sent successfully');
    } catch (error) {
      console.error('Error sending notification:', error);
      toast.error('Failed to send notification');
    }
  };
  
  const sendAllOverdueNotifications = async () => {
    try {
      const res = await axios.post('/api/notifications/overdue');
      toast.success(`Sent ${res.data.results.length} overdue notifications`);
    } catch (error) {
      console.error('Error sending overdue notifications:', error);
      toast.error('Failed to send overdue notifications');
    }
  };
  
  if (loading) {
    return <div className="text-center mt-3">Loading...</div>;
  }
  
  return (
    <div>
      <h1 className="mb-3">Admin Panel</h1>
      
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <h2>Generate Weekly Assignments</h2>
          </div>
          <div className="p-2">
            <div className="form-group">
              <label htmlFor="start-date">Start Date (Monday)</label>
              <input
                type="date"
                id="start-date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              onClick={generateAssignments}
              disabled={generating}
            >
              {generating ? 'Generating...' : 'Generate Assignments'}
            </button>
          </div>
        </div>
        
        <div className="card">
          <div className="card-header">
            <h2>Settings</h2>
          </div>
          <div className="p-2">
            <p>Configure application settings, notification preferences, and more.</p>
            <Link to="/settings" className="btn btn-primary mt-2">
              Manage Settings
            </Link>
          </div>
        </div>
      </div>
      
      <div className="card mt-3">
        <div className="card-header">
          <h2>Overdue Duties</h2>
          {overdueDuties.length > 0 && (
            <button
              className="btn btn-warning"
              onClick={sendAllOverdueNotifications}
            >
              Send All Reminders
            </button>
          )}
        </div>
        
        {overdueDuties.length === 0 ? (
          <p className="p-2">No overdue duties found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Duty</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {overdueDuties.map(duty => (
                <tr key={duty.id}>
                  <td>{duty.duty_name}</td>
                  <td>{duty.person_name}</td>
                  <td className="text-danger">{duty.due_date}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => sendNotifications(duty.id)}
                    >
                      Send Reminder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;