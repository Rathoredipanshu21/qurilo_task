// // src/App.js
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import LoginPage from './pages/LoginPage';
// import AdminDashboard from './pages/AdminDashboard';
// import LearnerDashboard from './pages/LearnerDashboard';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//         <Route path="/admin" element={<AdminDashboard />} />
//         <Route path="/learner" element={<LearnerDashboard />} />
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;




import React, { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import 'aos/dist/aos.css'; // AOS CSS

function App() {
  const [isAdminMode, setIsAdminMode] = useState(false); // State to toggle between Admin and User view

  return (
    <div style={{ backgroundColor: '#F8F9FA' }}> {/* Overall background for the app */}
      {/* Navbar for switching views */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
        <div className="container-fluid px-md-5">
        <a className="navbar-brand fw-bold text-info d-flex align-items-center" href="" style={{ fontSize: '1.5rem' }}>
  <img
    src="https://qurilo.com/assets/common/images/logo.png"
    alt="Qurilo Task"
    style={{ height: '30px', marginRight: '10px' }}
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
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  className={`btn ${isAdminMode ? 'btn-outline-light' : 'btn-info'} rounded-pill px-4 py-2 mt-2 mt-lg-0`}
                  onClick={() => setIsAdminMode(!isAdminMode)}
                >
                  {isAdminMode ? (
                    <>
                      <i className="fas fa-user me-2"></i>Switch to User View
                    </>
                  ) : (
                    <>
                      <i className="fas fa-user-shield me-2"></i>Switch to Admin View
                    </>
                  )}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Render the selected dashboard */}
      {isAdminMode ? <AdminDashboard /> : <UserDashboard />}
    </div>
  );
}

export default App;