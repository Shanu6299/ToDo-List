import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/features/authSlice";
import { useNavigate } from "react-router-dom";
import "../styles/Layout.css";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };
  
  // Generate initials for the avatar if no user image is available
  const getUserInitials = () => {
    if (user && user.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return 'U';
  };
  return (
    <div className="layout-container">
      <header className="layout-header">
        <div className="app-title">
          <h1>To-Do List</h1>
        </div>
        <div className="profile-section">
          <a href="/profile" title="View Profile">
            <img 
              src={`https://ui-avatars.com/api/?name=${getUserInitials()}&background=6e6be8&color=fff`} 
              alt="Profile" 
              className="profile-icon" 
            />
          </a>
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
};
export default Layout;