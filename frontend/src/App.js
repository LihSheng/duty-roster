import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Components
import Navbar from './components/layout/Navbar';
import Dashboard from './components/Dashboard';
import Calendar from './components/Calendar';
import PeopleList from './components/people/PeopleList';
import DutyList from './components/duties/DutyList';
import AdminPanel from './components/admin/AdminPanel';
import Settings from './components/admin/Settings';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/people" element={<PeopleList />} />
            <Route path="/duties" element={<DutyList />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
        <ToastContainer position="bottom-right" />
      </div>
    </Router>
  );
}

export default App;