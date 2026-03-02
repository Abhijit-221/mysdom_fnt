import React, { useContext } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { MdOutlineLiveHelp } from "react-icons/md";

const Navbar = () => {
  let navigate = useNavigate();
  function loginhandler() {
    navigate('/login');
  }
  const { user, logout } = useContext(AuthContext);
  console.log("user:", user);

  return (
    <>
      {/* Top Bar */}
      <div className="topbar">
        <div className="topbar-container">

          {/* LEFT */}
          <div className="topbar-left">
            <a href="/help">Get Help</a>
          </div>

          {/* CENTER */}
          <div className="topbar-divider">|</div>

          {/* RIGHT */}
          <div className="topbar-right">
            {user ? (
              <>
                <div className="profile">
                  <FaUserCircle size={22} />
                  <span className="username">{user.username}</span>
                </div>

                <button className="logout-btn" onClick={()=>(logout())}>
                  Logout
                </button>
              </>
            ) : (
              <button className="login-btn" onClick={loginhandler}>
                Login
              </button>
            )}
          </div>

        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo" onClick={()=>(navigate('/'))}>
            <span className="logo-green">mys</span>
            <span className="logo-pink">dom</span>
          </div>

          {/* Menu */}
          <ul className="nav-links">
            <li onClick={()=>(navigate('/services'))}>Services</li>
            <li>Industries </li>
            <li>Resources </li>
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <li><Link to="/manage-users">Manage Users</Link></li>
            )}
            <li>About Us</li>
            <li>Contact</li>
          </ul>

          {/* Buttons */}
          <div className="nav-buttons">
            <button className="btn-outline">Get Pricing</button>
            <button className="nav-btn-primary" >Talk to sales</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
