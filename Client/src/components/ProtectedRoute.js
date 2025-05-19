import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";
import { useSelector, useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setCredentials, logout } from "../redux/features/authSlice";

export default function ProtectedRoute({ children }) {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  // Get user data from token
  const getUser = async () => {
    try {
      dispatch(showLoading());
      const token = localStorage.getItem("token");
      
      if (!token) {
        dispatch(logout());
        dispatch(hideLoading());
        return;
      }
      
      const res = await axiosInstance.post("/api/auth/getUserData", {});
      
      dispatch(hideLoading());
      if (res.data.success) {
        dispatch(setCredentials({
          user: res.data.data,
          token: token
        }));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Authentication error:", error);
      dispatch(logout());
      dispatch(hideLoading());
    }
  };

  useEffect(() => {
    if (!isAuthenticated && localStorage.getItem("token")) {
      getUser();
    }
  }, [isAuthenticated]);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  // If authenticated, render children
  if (isAuthenticated) {
    return children;
  } 
  
  // If there's a token but not authenticated yet, we're still validating
  if (localStorage.getItem("token")) {
    return children;
  } 
  
  // No token and not authenticated, redirect to login
  return <Navigate to="/login" />
}