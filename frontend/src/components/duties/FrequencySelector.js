import React, { useState, useEffect } from 'react';

const FrequencySelector = ({ frequency, days, onChange, showTooltips = true }) => {
  const [selectedFrequency, setSelectedFrequency] = useState(frequency || 'daily');
  const [selectedDays, setSelectedDays] = useState(days || []);
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5]); // Mon-Fri by default
  const [monthlyOption, setMonthlyOption] = useState('last'); // 'last', 'first', 'specific'
  const [monthlyDay, setMonthlyDay] = useState(5); // Friday by default
  const [monthlyWeek, setMonthlyWeek] = useState(4); // Last week by default

  useEffect(() => {
    setSelectedFrequency(frequency || 'daily');
    setSelectedDays(days || []);
  }, [frequency, days]);

  const handleFrequencyChange = (e) => {
    const newFrequency = e.target.value;
    setSelectedFrequency(newFrequency);
    
    // Set default days based on frequency
    let newDays = [];
    if (newFrequency === 'daily') {
      newDays = [];
    } else if (newFrequency === 'working_days') {
      newDays = [...workingDays];
    } else if (newFrequency === 'weekly') {
      newDays = [];
    } else if (newFrequency === 'monthly') {
      // For monthly, we'll use a special format: [week, day]
      // week: 1-4 (first to fourth week) or -1 (last week)
      // day: 0-6 (Sunday to Saturday)
      if (monthlyOption === 'last') {
        newDays = [-1, monthlyDay];
      } else if (monthlyOption === 'first') {
        newDays = [1, monthlyDay];
      } else {
        newDays = [monthlyWeek, monthlyDay];
      }
    }
    
    onChange(newFrequency, newDays);
  };

  const handleDayToggle = (day) => {
    let newDays = [...selectedDays];
    
    if (newDays.includes(day)) {
      newDays = newDays.filter(d => d !== day);
    } else {
      newDays.push(day);
      newDays.sort((a, b) => a - b);
    }
    
    setSelectedDays(newDays);
    onChange(selectedFrequency, newDays);
  };

  const handleMonthlyOptionChange = (e) => {
    const option = e.target.value;
    setMonthlyOption(option);
    
    let newDays = [];
    if (option === 'last') {
      newDays = [-1, monthlyDay];
    } else if (option === 'first') {
      newDays = [1, monthlyDay];
    } else {
      newDays = [monthlyWeek, monthlyDay];
    }
    
    setSelectedDays(newDays);
    onChange(selectedFrequency, newDays);
  };

  const handleMonthlyDayChange = (e) => {
    const day = parseInt(e.target.value);
    setMonthlyDay(day);
    
    let newDays = [];
    if (monthlyOption === 'last') {
      newDays = [-1, day];
    } else if (monthlyOption === 'first') {
      newDays = [1, day];
    } else {
      newDays = [monthlyWeek, day];
    }
    
    setSelectedDays(newDays);
    onChange(selectedFrequency, newDays);
  };

  const handleMonthlyWeekChange = (e) => {
    const week = parseInt(e.target.value);
    setMonthlyWeek(week);
    
    const newDays = [week, monthlyDay];
    setSelectedDays(newDays);
    onChange(selectedFrequency, newDays);
  };

  const renderTooltip = (text) => {
    if (!showTooltips) return null;
    
    return (
      <div className="tooltip">
        <span className="tooltip-icon">?</span>
        <span className="tooltip-text">{text}</span>
      </div>
    );
  };

  return (
    <div className="frequency-selector">
      <div className="form-group">
        <label htmlFor="frequency">Frequency</label>
        <select
          id="frequency"
          value={selectedFrequency}
          onChange={handleFrequencyChange}
          className="form-control"
        >
          <option value="daily">Daily</option>
          <option value="working_days">Working Days (Mon-Fri)</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="custom">Custom (Manual Assignment Only)</option>
        </select>
      </div>

      {selectedFrequency === 'weekly' && (
        <div className="form-group">
          <label>Days of Week</label>
          {renderTooltip("Select which days of the week this duty should be assigned.")}
          <div className="days-grid">
            {[
              { value: 0, label: 'Sun' },
              { value: 1, label: 'Mon' },
              { value: 2, label: 'Tue' },
              { value: 3, label: 'Wed' },
              { value: 4, label: 'Thu' },
              { value: 5, label: 'Fri' },
              { value: 6, label: 'Sat' }
            ].map(day => (
              <div key={day.value} className="day-checkbox">
                <input
                  type="checkbox"
                  id={`day-${day.value}`}
                  checked={selectedDays.includes(day.value)}
                  onChange={() => handleDayToggle(day.value)}
                />
                <label htmlFor={`day-${day.value}`}>{day.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFrequency === 'working_days' && (
        <div className="form-group">
          <label>Customize Working Days</label>
          {renderTooltip("By default, working days are Monday to Friday. You can customize which days are considered working days.")}
          <div className="days-grid">
            {[
              { value: 0, label: 'Sun' },
              { value: 1, label: 'Mon' },
              { value: 2, label: 'Tue' },
              { value: 3, label: 'Wed' },
              { value: 4, label: 'Thu' },
              { value: 5, label: 'Fri' },
              { value: 6, label: 'Sat' }
            ].map(day => (
              <div key={day.value} className="day-checkbox">
                <input
                  type="checkbox"
                  id={`workday-${day.value}`}
                  checked={workingDays.includes(day.value)}
                  onChange={() => {
                    const newWorkingDays = workingDays.includes(day.value)
                      ? workingDays.filter(d => d !== day.value)
                      : [...workingDays, day.value].sort();
                    setWorkingDays(newWorkingDays);
                    setSelectedDays(newWorkingDays);
                    onChange(selectedFrequency, newWorkingDays);
                  }}
                />
                <label htmlFor={`workday-${day.value}`}>{day.label}</label>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedFrequency === 'monthly' && (
        <div className="monthly-options">
          <div className="form-group">
            <label>Monthly Option</label>
            {renderTooltip("Choose how to schedule the monthly duty.")}
            <select
              value={monthlyOption}
              onChange={handleMonthlyOptionChange}
              className="form-control"
            >
              <option value="last">Last specific day of month</option>
              <option value="first">First specific day of month</option>
              <option value="specific">Specific week and day</option>
            </select>
          </div>

          <div className="form-group">
            <label>Day of Week</label>
            <select
              value={monthlyDay}
              onChange={handleMonthlyDayChange}
              className="form-control"
            >
              <option value={0}>Sunday</option>
              <option value={1}>Monday</option>
              <option value={2}>Tuesday</option>
              <option value={3}>Wednesday</option>
              <option value={4}>Thursday</option>
              <option value={5}>Friday</option>
              <option value={6}>Saturday</option>
            </select>
          </div>

          {monthlyOption === 'specific' && (
            <div className="form-group">
              <label>Week of Month</label>
              {renderTooltip("If the selected week doesn't have the specified day (e.g., 5th Sunday), the duty will be assigned to the last occurrence of that day in the month.")}
              <select
                value={monthlyWeek}
                onChange={handleMonthlyWeekChange}
                className="form-control"
              >
                <option value={1}>First</option>
                <option value={2}>Second</option>
                <option value={3}>Third</option>
                <option value={4}>Fourth</option>
              </select>
            </div>
          )}

          <div className="form-note">
            <small>
              <strong>Note:</strong> If the selected day falls on a non-working day, the duty will be assigned to the last working day before it.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequencySelector;