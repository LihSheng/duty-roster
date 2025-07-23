import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components (always loaded)
import Navbar from './components/layout/Navbar';
import { ThemeProvider } from './components/theme/ThemeProvider';

// Lazy loaded components
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Calendar = React.lazy(() => import('./components/Calendar'));
const PeopleList = React.lazy(() => import('./components/people/PeopleList'));
const DutyList = React.lazy(() => import('./components/duties/DutyList'));
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
const Settings = React.lazy(() => import('./components/admin/Settings'));

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app min-h-screen transition-colors duration-200">
          <Navbar />
          <main className="container mx-auto pt-6">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/calendar" element={<Calendar />} />
                <Route path="/people" element={<PeopleList />} />
                <Route path="/duties" element={<DutyList />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Suspense>
          </main>
          <ToastContainer position="bottom-right" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

