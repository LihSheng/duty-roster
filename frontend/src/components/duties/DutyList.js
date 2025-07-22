import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import DutyForm from './DutyForm';

const DutyList = () => {
  const [duties, setDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [currentDuty, setCurrentDuty] = useState(null);
  
  useEffect(() => {
    fetchDuties();
  }, []);
  
  const fetchDuties = async () => {
    try {
      const res = await axios.get('/api/duties');
      setDuties(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching duties:', error);
      setLoading(false);
      toast.error('Failed to load duties');
    }
  };
  
  const addDuty = async (dutyData) => {
    try {
      const res = await axios.post('/api/duties', dutyData);
      setDuties([...duties, { id: res.data.id, ...dutyData }]);
      setShowForm(false);
      toast.success('Duty created successfully');
    } catch (error) {
      console.error('Error adding duty:', error);
      toast.error('Failed to create duty');
    }
  };
  
  const updateDuty = async (id, dutyData) => {
    try {
      await axios.put(`/api/duties/${id}`, dutyData);
      setDuties(duties.map(d => (d.id === id ? { ...d, ...dutyData } : d)));
      setShowForm(false);
      setCurrentDuty(null);
      toast.success('Duty updated successfully');
    } catch (error) {
      console.error('Error updating duty:', error);
      toast.error('Failed to update duty');
    }
  };
  
  const deleteDuty = async (id) => {
    if (window.confirm('Are you sure you want to delete this duty?')) {
      try {
        await axios.delete(`/api/duties/${id}`);
        setDuties(duties.filter(d => d.id !== id));
        toast.success('Duty deleted successfully');
      } catch (error) {
        console.error('Error deleting duty:', error);
        toast.error('Failed to delete duty');
      }
    }
  };
  
  const openEditForm = (duty) => {
    setCurrentDuty(duty);
    setShowForm(true);
  };
  
  const closeForm = () => {
    setShowForm(false);
    setCurrentDuty(null);
  };
  
  const formatFrequency = (duty) => {
    if (duty.frequency === 'daily') {
      return 'Daily';
    } else if (duty.frequency === 'working_days') {
      let days = [];
      try {
        // Try to parse the days_of_week as JSON if it's a string
        if (typeof duty.days_of_week === 'string') {
          days = JSON.parse(duty.days_of_week || '[]');
        } else if (Array.isArray(duty.days_of_week)) {
          // If it's already an array, use it directly
          days = duty.days_of_week;
        }
      } catch (error) {
        console.error('Error parsing days_of_week:', error, duty.days_of_week);
        days = [1, 2, 3, 4, 5]; // Default to Mon-Fri if parsing fails
      }
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `Working Days (${days.map(d => dayNames[d] || '').filter(Boolean).join(', ')})`;
    } else if (duty.frequency === 'weekly') {
      let days = [];
      try {
        // Try to parse the days_of_week as JSON if it's a string
        if (typeof duty.days_of_week === 'string') {
          days = JSON.parse(duty.days_of_week || '[]');
        } else if (Array.isArray(duty.days_of_week)) {
          // If it's already an array, use it directly
          days = duty.days_of_week;
        }
      } catch (error) {
        console.error('Error parsing days_of_week:', error, duty.days_of_week);
        days = []; // Default to empty array if parsing fails
      }
      
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      return `Weekly (${days.map(d => dayNames[d] || '').filter(Boolean).join(', ') || 'No days selected'})`;
    } else if (duty.frequency === 'monthly') {
      let days = [];
      try {
        // Try to parse the days_of_week as JSON if it's a string
        if (typeof duty.days_of_week === 'string') {
          days = JSON.parse(duty.days_of_week || '[]');
        } else if (Array.isArray(duty.days_of_week)) {
          // If it's already an array, use it directly
          days = duty.days_of_week;
        }
      } catch (error) {
        console.error('Error parsing days_of_week:', error, duty.days_of_week);
        days = [-1, 5]; // Default to last Friday if parsing fails
      }
      
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const weekNames = ['First', 'Second', 'Third', 'Fourth', 'Last'];
      
      if (days.length >= 2) {
        const [week, day] = days;
        const weekName = week === -1 ? 'Last' : weekNames[week - 1] || 'Unknown';
        const dayName = dayNames[day] || 'Unknown';
        return `Monthly (${weekName} ${dayName})`;
      } else if (duty.name === 'House keeping') {
        return 'Monthly (Last Friday)';
      } else {
        return 'Monthly';
      }
    } else if (duty.frequency === 'custom') {
      return 'Custom (Manual Assignment)';
    } else {
      return duty.frequency || 'Unknown';
    }
  };
  
  if (loading) {
    return <div className="text-center mt-3">Loading...</div>;
  }
  
  return (
    <div>
      <div className="flex-between mb-3">
        <h1>Duties</h1>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Duty
        </button>
      </div>
      
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{currentDuty ? 'Edit Duty' : 'Add Duty'}</h2>
              <button className="btn" onClick={closeForm}>
                &times;
              </button>
            </div>
            <div className="modal-body">
              <DutyForm
                duty={currentDuty}
                onSubmit={currentDuty ? updateDuty : addDuty}
                onCancel={closeForm}
              />
            </div>
          </div>
        </div>
      )}
      
      {duties.length === 0 ? (
        <p>No duties found. Add a duty to get started.</p>
      ) : (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Frequency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {duties.map(duty => (
                <tr key={duty.id}>
                  <td>{duty.name}</td>
                  <td>{duty.description || '-'}</td>
                  <td>{formatFrequency(duty)}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => openEditForm(duty)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => deleteDuty(duty.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DutyList;