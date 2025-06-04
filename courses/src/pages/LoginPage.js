import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [role, setRole] = useState('learner');
  const navigate = useNavigate();

  const handleLogin = () => {
    localStorage.setItem('role', role);
    if (role === 'admin') navigate('/admin');
    else navigate('/learner');
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Login</h2>
      <div className="form-group mb-3">
        <label>Select Role:</label>
        <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="learner">Learner</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <button onClick={handleLogin} className="btn btn-primary">
        Continue
      </button>
    </div>
  );
}

export default LoginPage;
