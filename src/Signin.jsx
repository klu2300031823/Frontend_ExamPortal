import React, { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import './Signin.css';
import { callApi, setSession } from './api';

const base_url = "http://localhost:8085"; // Change this when deploying

export default function Signin() {
  const navigate = useNavigate();
  const { setLoggedIn, setUsername, setRole } = useOutletContext(); // ✅ get setters

  const [form, setForm] = useState({ username: '', password: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      alert('All fields are required!');
      return;
    }

    callApi('POST', `${base_url}/users/signin`, JSON.stringify(form), handleResponse);
  };

  const handleResponse = (res) => {
    const rdata = res.split('::');
    if (rdata[0] === '200') {
      setSession('csr', rdata[1], 1);
      localStorage.setItem('username', form.username);
      localStorage.setItem('role', rdata[2]); // store role
      setLoggedIn(true);
      setUsername(form.username);
      setRole(rdata[2]); // update role immediately
      alert('Login successful!');
      if (rdata[2] === 'admin') navigate('/admin');
      else navigate('/user');
    } else alert(rdata[1]);
  };

  return (
    <div className="signin-wrapper">
      <div className="signin-box">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input type="text" name="username" value={form.username} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={form.password} onChange={handleChange} required />

          <button type="submit" className="signin-btn">Login</button>
        </form>

        <p className="signin-link">
          Don't have an account? <span onClick={() => navigate('/signup')} style={{color:"blue", cursor:"pointer"}}>Register</span>
        </p>
      </div>
    </div>
  );
}
