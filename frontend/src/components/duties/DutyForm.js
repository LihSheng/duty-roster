import React, { useState, useEffect } from 'react';
import FrequencySelector from './FrequencySelector';

const DutyForm = ({ duty, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    frequency: 'daily',
    days_of_week: []
  });
  
  useEffect(() => {
    if (duty) {
      let days_of_week = [];
      try {
        // Try to parse the days_of_week as JSON if it's a string
        if (typeof duty.days_of_week === 'string') {
          days_of_week = JSON.parse(duty.days_of_week || '[]');
        } else if (Array.isArray(duty.days_of_week)) {
          // If it's already an array, use it directly
          days_of_week = duty.days_of_week;
        }
      } catch (error) {
        console.error('Error parsing days_of_week:', error);
        days_of_week = []; // Default to empty array if parsing fails
      }
      
      setFormData({
        name: duty.name || '',
        description: duty.description || '',
        frequency: duty.frequency || 'daily',
        days_of_week: days_of_week
      });
    }
  }, [duty]);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleFrequencyChange = (frequency, days) => {
    setFormData({
      ...formData,
      frequency,
      days_of_week: days
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Name is required');
      return;
    }
    
    if (formData.frequency === 'weekly' && formData.days_of_week.length === 0) {
      alert('Please select at least one day of the week');
      return;
    }
    
    // Make sure days_of_week is an array before submitting
    const submissionData = {
      ...formData,
      days_of_week: Array.isArray(formData.days_of_week) ? formData.days_of_week : []
    };
    
    if (duty) {
      onSubmit(duty.id, submissionData);
    } else {
      onSubmit(submissionData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
        ></textarea>
      </div>
      
      <FrequencySelector 
        frequency={formData.frequency}
        days={formData.days_of_week}
        onChange={handleFrequencyChange}
      />
      
      <div className="modal-footer">
        <button type="button" className="btn" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {duty ? 'Update' : 'Add'}
        </button>
      </div>
    </form>
  );
};

export default DutyForm;