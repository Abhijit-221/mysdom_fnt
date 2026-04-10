import React, { useContext } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";

const Navbar = () => {
  let navigate = useNavigate();

  const handleAboutClick = () => {
    navigate("/about");
    // if (location.pathname !== "/") {
    //   navigate("/#about");
    //   document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

    // } else {
    //   document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
    // }

  };
  function loginhandler() {
    navigate('/login');
  }
  const { user, logout } = useContext(AuthContext);
  console.log("user:", user);

  return (
    <>
      {/* Top Bar */}
      <div className="tb-wrapper">
        <div className="tb-container">

          {/* LEFT */}
          <div className="tb-left">
            <p onClick={()=>navigate('/contact')}>Get Help</p>
          </div>
          <div className="tb-devide">
            |
          </div>
          {/* RIGHT */}
          <div className="tb-right">
            {user ? (
              <>
                <div className="tb-profile">
                  <FaUserCircle className="tb-user-icon" />
                  <span className="tb-username">{user.username}</span>
                </div>

                <button className="tb-logout-btn" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <button className="tb-login-btn" onClick={loginhandler}>
                Login
              </button>
            )}
          </div>

        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo" onClick={() => (navigate('/'))}>
            {/* <span className="logo-green">mys</span>
            <span className="logo-pink">dom</span> */}
            <img src="logo.png" alt="" />
          </div>

          {/* Menu */}
          <ul className="nav-links">
            <li onClick={()=>navigate('/')}>Home</li>
            <li onClick={handleAboutClick}>About Us</li>
            <li onClick={() => (navigate('/services'))}>Services</li>
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <li><Link to="/clients">Clients</Link></li>
            )}
            <li><Link to="/product">Product</Link></li>
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <li><Link to="/manage-users">Manage Users</Link></li>
            )}
            <li onClick={() => navigate('/contact')}>
              Contact Us
            </li>
          </ul>

          {/* Buttons */}
          <div className="nav-buttons">
            {/* <button className="btn-outline">Get Pricing</button> */}
            <button className="nav-btn-primary" onClick={()=>navigate('/contact')} >Talk to sales</button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
