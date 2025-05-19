import React, { useEffect } from "react";
import Layout from "./../components/Layout";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { initializeAuth } from "../redux/features/authSlice";
import TodoList from "../../app/components/TodoList";
import axiosInstance from "../utils/axiosConfig";
import "../styles/HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication state from localStorage
    dispatch(initializeAuth());
    
    // If not authenticated, redirect to login
    if (!isAuthenticated && !localStorage.getItem('token')) {
      navigate("/login");
    }
  }, [navigate, dispatch, isAuthenticated]);

  return (
    <Layout>
      <TodoList />
    </Layout>
  );
};

export default HomePage;
