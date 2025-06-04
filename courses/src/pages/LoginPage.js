import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(''); 

    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    const success = onLogin(username, password);
    if (!success) {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#860C5E', fontFamily: 'Montserrat, sans-serif' }}>
      <style>
        {`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
        .login-card {
            background: linear-gradient(135deg, #ffffff, #f8f9fa); /* Subtle gradient for card */
            border-radius: 1.5rem;
            box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2); /* Stronger shadow */
            padding: 3rem; /* More padding */
            max-width: 480px; /* Slightly wider */
            width: 90%; /* Responsive width */
            animation: fadeInScale 0.8s ease-out; /* Custom animation */
        }
        @keyframes fadeInScale {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
        .form-icon-input {
            position: relative;
        }
        .form-icon-input .form-control {
            padding-left: 3.5rem; /* More space for the icon */
            border-radius: 50px;
            height: 55px; /* Taller for better touch target */
            border: 1px solid #ced4da;
            transition: all 0.3s ease;
        }
        .form-icon-input .form-control:focus {
            border-color: #860C5E; /* Highlight on focus */
            box-shadow: 0 0 0 0.25rem rgba(134, 12, 94, 0.25);
        }
        .form-icon-input .input-icon {
            position: absolute;
            left: 1.2rem;
            top: 50%;
            transform: translateY(-50%);
            color: #860C5E; /* Icon color matching theme */
            font-size: 1.4rem; /* Larger icon */
            z-index: 2;
        }
        .btn-login {
            background: linear-gradient(45deg, #860C5E, #C70039); /* Deep purple to red gradient */
            border: none;
            color: white;
            font-weight: 600;
            padding: 1rem 2rem; /* More padding */
            border-radius: 50px;
            box-shadow: 0 6px 15px rgba(134, 12, 94, 0.4);
            transition: all 0.3s ease;
            font-size: 1.2rem; /* Larger text */
        }
        .btn-login:hover {
            transform: translateY(-3px); /* More pronounced lift */
            box-shadow: 0 8px 20px rgba(134, 12, 94, 0.6);
            color: white;
        }
        .alert-danger {
            border-radius: 0.75rem;
            font-weight: 500;
        }
        `}
      </style>
      <div className="login-card text-center" data-aos="zoom-in">
        <h3 className="mb-5 text-dark fw-bold">
          <i className="fas fa-sign-in-alt me-3 text-primary"></i>Welcome to Qurilo Task
        </h3>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger mb-4" role="alert">{error}</div>}
          <div className="form-group mb-4 form-icon-input">
            <i className="fas fa-user input-icon"></i>
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-5 form-icon-input">
            <i className="fas fa-key input-icon"></i>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-login btn-lg w-100">
            <i className="fas fa-arrow-right me-2"></i>Proceed
          </button>
        </form>
        <p className="mt-5 text-muted small">
          <i className="fas fa-info-circle me-1"></i>Demo Credentials: <br/>
          **Admin:** `admin` / `admin` <br/>
          **User:** `user` / `user`
        </p>
      </div>
    </div>
  );
}

export default LoginPage;