import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { setCredentials } from "../redux/features/authSlice";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosConfig";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axiosInstance.post("/api/auth/login", values);
      dispatch(hideLoading());
      if (res.data.success) {
        // Save token to localStorage and update auth state
        localStorage.setItem('token', res.data.token);
        dispatch(setCredentials({
          user: res.data.user,
          token: res.data.token
        }));
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || "Something went wrong!");
      console.error("Login error:", error);
    }
  };
  return (
    <div className="auth-main-container">
      <div className="auth-box">
        <div className="auth-left">
          <div className="form-container">
            <Form layout="vertical" onFinish={onfinishHandler} className="register-form">
              <div className="logo-container">
                <h3 className='text-center'>Hello, <br/><span className="welcome-text">Welcome!</span></h3>
              </div>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> <Input type="email" /> </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}> <Input.Password /> </Form.Item>
              <div className="button-group">
                <button className="btn btn-primary" type="submit">Login</button>
              </div>
              <div style={{ marginTop: 16 }}>
                Don\'t have an account? <Link to="/register" className="btn btn-outline">Register</Link>
              </div>
            </Form>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-image-bg">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80" alt="Login Visual" className="auth-image" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;