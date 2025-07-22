import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalDuties: 0,
    totalPeople: 0,
    pendingAssignments: 0,
    overdueAssignments: 0
  });
  
  const [todayDuties, setTodayDuties] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split('T')[0];
        
        // Fetch today's assignments
        const assignmentsRes = await axios.get(`/api/assignments?start_date=${today}&end_date=${today}`);
        setTodayDuties(assignmentsRes.data);
        
        // Fetch stats
        const [dutiesRes, peopleRes, overdueRes] = await Promise.all([
          axios.get('/api/duties'),
          axios.get('/api/people'),
          axios.get('/api/admin/overdue')
        ]);
        
        setStats({
          totalDuties: dutiesRes.data.length,
          totalPeople: peopleRes.data.length,
          pendingAssignments: assignmentsRes.data.filter(a => a.status === 'pending').length,
          overdueAssignments: overdueRes.data.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const markAsCompleted = async (id) => {
    try {
      await axios.put(`/api/assignments/${id}/complete`);
      
      // Update the local state
      setTodayDuties(
        todayDuties.map(duty => 
          duty.id === id ? { ...duty, status: 'completed' } : duty
        )
      );
      
      // Update stats
      setStats({
        ...stats,
        pendingAssignments: stats.pendingAssignments - 1
      });
    } catch (error) {
      console.error('Error marking duty as completed:', error);
    }
  };
  
  if (loading) {
    return <div className="text-center mt-3">Loading...</div>;
  }
  
  return (
    <div>
      <h1 className="mb-3">Dashboard</h1>
      
      <div className="dashboard-stats mb-3">
        <div className="stat-card">
          <h3>{stats.totalDuties}</h3>
          <p>Total Duties</p>
          <Link to="/duties" className="btn btn-primary btn-sm mt-1">Manage</Link>
        </div>
        
        <div className="stat-card">
          <h3>{stats.totalPeople}</h3>
          <p>People</p>
          <Link to="/people" className="btn btn-primary btn-sm mt-1">Manage</Link>
        </div>
        
        <div className="stat-card">
          <h3>{stats.pendingAssignments}</h3>
          <p>Pending Assignments</p>
          <Link to="/calendar" className="btn btn-primary btn-sm mt-1">View</Link>
        </div>
        
        <div className="stat-card">
          <h3>{stats.overdueAssignments}</h3>
          <p>Overdue Assignments</p>
          <Link to="/admin" className="btn btn-danger btn-sm mt-1">Manage</Link>
        </div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <h2>Today's Duties</h2>
        </div>
        
        {todayDuties.length === 0 ? (
          <p>No duties scheduled for today.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Duty</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todayDuties.map(duty => (
                <tr key={duty.id}>
                  <td>{duty.duty_name}</td>
                  <td>{duty.person_name}</td>
                  <td>
                    {duty.status === 'completed' ? (
                      <span className="text-success">Completed</span>
                    ) : (
                      <span className="text-danger">Pending</span>
                    )}
                  </td>
                  <td>
                    {duty.status === 'pending' && (
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => markAsCompleted(duty.id)}
                      >
                        Mark Complete
                      </button>
                    )}
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

export default Dashboard;