import React, { useContext } from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaUserCircle } from "react-icons/fa";
import { getActiveUser, isAdminRole, isBasicUserRole } from "../utils/roleAccess";

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
  const activeUser = getActiveUser(user);
  const isUserOnly = isBasicUserRole(activeUser?.role);
  const canAccessAllPages = isAdminRole(activeUser?.role);
  const showContactSalesButton = !activeUser || isUserOnly;
  const navItems = isUserOnly
    ? [
      { label: "Home", to: "/" },
      { label: "BGV", to: "/bgv/list" },
      { label: "Contact Us", to: "/contact" },
    ]
    : [
        { label: "Home", to: "/" },
        { label: "About Us", to: "/about" },
        { label: "Services", to: "/services" },
        ...(canAccessAllPages ? [{ label: "Clients", to: "/clients" }] : []),
        { label: "Product", to: "/product" },
        ...(canAccessAllPages ? [{ label: "Manage Users", to: "/manage-users" }] : []),
        { label: "Contact Us", to: "/contact" },
      ];

  return (
    <>
      {/* Top Bar */}
      <div className="tb-wrapper">
        <div className="tb-container">
          <div className="tb-right">
            {activeUser ? (
              <>
                <div className="tb-profile" onClick={() => navigate(`/users/${activeUser.id}`)}>
                  <FaUserCircle className="tb-user-icon" />
                  <span className="tb-username">{activeUser.username}</span>
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

            <div className="tb-devide">
              |
            </div>

            <div className="tb-text-actions">
              <p onClick={() => navigate('/contact')}>Get Help</p>
            </div>
          </div>

        </div>
      </div>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Logo */}
          <div className="logo" onClick={() => navigate(isUserOnly ? "/bgv/list" : "/")}>
            {/* <span className="logo-green">mys</span>
            <span className="logo-pink">dom</span> */}
            <img src="/logo.png" alt="Mysdom logo" />
          </div>

          {/* Menu */}
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.to}>
                {item.to === "/about" ? (
                  <span onClick={handleAboutClick}>{item.label}</span>
                ) : (
                  <Link to={item.to}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>

          <div className="nav-buttons">
            {showContactSalesButton && (
              <button
                className="nav-btn-primary"
                type="button"
                onClick={() => navigate("/contact")}
              >
                Talk to Sales
              </button>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
