import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import './App.css';

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("username");
    const userRole = localStorage.getItem("role");
    if (user) {
      setLoggedIn(true);
      setUsername(user);
      setRole(userRole);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    localStorage.removeItem("csr"); 
    setLoggedIn(false);
    setUsername('');
    setRole('');
    navigate("/signin");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">Online Exam Portal</div>
        <div className="nav-links">
          {loggedIn ? (
            <>
              <span className="welcome-msg">Welcome, {username} ({role})</span>
              <button onClick={handleLogout} className="nav-btn">Logout</button>
            </>
          ) : (
            <>
              <Link to="/signin" className="nav-btn">Login</Link>
              <Link to="/signup" className="nav-btn">Register</Link>
            </>
          )}
        </div>
      </nav>

      <main>
        <Outlet context={{ setLoggedIn, setUsername, setRole }} />
      </main>
    </div>
  );
}
