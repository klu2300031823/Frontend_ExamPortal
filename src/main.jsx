import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Signup from './Signup.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AdminPanel from './AdminPanel.jsx';
import UserPanel from './UserPanel.jsx';
import Signin from './Signin.jsx';
import Landing from './Landing.jsx';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/exam-frontend">
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Landing />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="admin" element={<AdminPanel />} />
          <Route path="user" element={<UserPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
