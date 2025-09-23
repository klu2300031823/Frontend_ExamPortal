import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { callApi } from './api';
import './Signup.css';

const base_url = "http://3.88.1.8:8085"; // Change this when deploying

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    role: 'user', // default role
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!form.email || !form.username || !form.password || !form.confirmPassword || !form.role) {
      alert("All fields are required!");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const data = JSON.stringify({
      username: form.username,
      fullname: form.username,
      email: form.email,
      password: form.password,
      role: form.role,
    });

    callApi("POST", `${base_url}/users/signup`, data, handleResponse);
  };

  const handleResponse = (res) => {
    const result = res.split("::");
    alert(result[1]);
    if (result[0] === "200") {
      setForm({ email: '', username: '', password: '', confirmPassword: '', role: 'user' });
      navigate('/signin'); // go to login page
    }
  };

  return (
    <div className="signup-wrapper">
      <div className="signup-box">
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />

          <label>Role</label>
          <div className="role-selection">
            <label>
              <input type="radio" name="role" value="user" checked={form.role === 'user'} onChange={handleChange} />
              User
            </label>
            <label>
              <input type="radio" name="role" value="admin" checked={form.role === 'admin'} onChange={handleChange} />
              Admin
            </label>
          </div>

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />

          <button type="submit" className="signup-btn">Sign Up</button>

          <p>
            Already have an account? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate('/signin')}>Login</span>
          </p>
        </form>
      </div>
    </div>
  );
}
