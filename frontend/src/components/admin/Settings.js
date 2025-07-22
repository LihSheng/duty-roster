import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Settings = () => {
  const [settings, setSettings] = useState({
    notification_email: true,
    notification_whatsapp: false,
    auto_assign_next: true,
    reminder_days: 1,
    admin_email: '',
    company_name: 'Duty Roster'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    try {
      const res = await axios.get('/api/admin/settings');
      
      if (Object.keys(res.data).length > 0) {
        const parsedSettings = {};
        
        // Parse JSON values
        Object.entries(res.data).forEach(([key, value]) => {
          try {
            parsedSettings[key] = JSON.parse(value);
          } catch (e) {
            parsedSettings[key] = value;
          }
        });
        
        setSettings({ ...settings, ...parsedSettings });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching settings:', error);
      setLoading(false);
      toast.error('Failed to load settings');
    }
  };
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: parseInt(value, 10)
    });
  };
  
  const saveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await axios.post('/api/admin/settings', settings);
      toast.success('Settings saved successfully');
      setSaving(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="text-center mt-3">Loading settings...</div>;
  }
  
  return (
    <div>
      <h1 className="mb-3">Settings</h1>
      
      <div className="card">
        <div className="card-header">
          <h2>Application Settings</h2>
        </div>
        
        <form onSubmit={saveSettings} className="p-2">
          <div className="form-group">
            <label htmlFor="company_name">Organization Name</label>
            <input
              type="text"
              id="company_name"
              name="company_name"
              value={settings.company_name}
              onChange={handleChange}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="admin_email">Admin Email</label>
            <input
              type="email"
              id="admin_email"
              name="admin_email"
              value={settings.admin_email}
              onChange={handleChange}
            />
            <small className="form-text">
              Used for system notifications and alerts
            </small>
          </div>
          
          <h3 className="mt-3 mb-2">Notification Settings</h3>
          
          <div className="form-group">
            <div>
              <input
                type="checkbox"
                id="notification_email"
                name="notification_email"
                checked={settings.notification_email}
                onChange={handleChange}
              />
              <label htmlFor="notification_email" className="ml-1">
                Enable Email Notifications
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <div>
              <input
                type="checkbox"
                id="notification_whatsapp"
                name="notification_whatsapp"
                checked={settings.notification_whatsapp}
                onChange={handleChange}
              />
              <label htmlFor="notification_whatsapp" className="ml-1">
                Enable WhatsApp Notifications
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="reminder_days">Reminder Days</label>
            <input
              type="number"
              id="reminder_days"
              name="reminder_days"
              min="0"
              max="7"
              value={settings.reminder_days}
              onChange={handleNumberChange}
            />
            <small className="form-text">
              Number of days before due date to send reminders
            </small>
          </div>
          
          <h3 className="mt-3 mb-2">Assignment Settings</h3>
          
          <div className="form-group">
            <div>
              <input
                type="checkbox"
                id="auto_assign_next"
                name="auto_assign_next"
                checked={settings.auto_assign_next}
                onChange={handleChange}
              />
              <label htmlFor="auto_assign_next" className="ml-1">
                Auto-assign to next person when duty is completed
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;