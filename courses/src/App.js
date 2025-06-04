import React, { useState, useEffect } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import LoginPage from './pages/LoginPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min'; 
import 'aos/dist/aos.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null); 
  const [userName, setUserName] = useState('');

  const users = {
    'admin': { password: 'admin', role: 'admin', name: 'Administrator' },
    'user': { password: 'user', role: 'user', name: 'Learner' },
  };

  useEffect(() => {
    const savedLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const savedUserRole = localStorage.getItem('userRole');
    const savedUserName = localStorage.getItem('userName');

    if (savedLoggedIn && savedUserRole && savedUserName) {
      setIsLoggedIn(true);
      setUserRole(savedUserRole);
      setUserName(savedUserName);
    }
  }, []);

  const handleLogin = (username, password) => {
    const user = users[username];
    if (user && user.password === password) {
      setIsLoggedIn(true);
      setUserRole(user.role);
      setUserName(user.name);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', user.role);
      localStorage.setItem('userName', user.name);
      return true;
    }
    return false; 
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
  };

  return (
    <div style={{ backgroundColor: '#860C5E', minHeight: '100vh' }}> 
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm py-3">
        <div className="container-fluid px-md-5">
          <a className="navbar-brand" href="#">
            <img
              src="https://qurilo.com/assets/common/images/logo.png"
              alt="Qurilo Logo"
              style={{ height: '40px' }} 
              className="d-inline-block align-top me-2"
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-center">
              {isLoggedIn && (
                <>
                  <li className="nav-item me-3 text-white-50">
                    <span className="d-flex align-items-center">
                      <i className="fas fa-user-circle me-2 text-warning"></i>
                      Welcome, <span className="fw-bold ms-1 text-white">{userName}</span>!
                    </span>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light rounded-pill px-4 py-2"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : userRole === 'admin' ? (
        <AdminDashboard />
      ) : (
        <UserDashboard />
      )}
    </div>
  );
}

export default App;