import React from "react";
import "../styles/RegisterStyles.css";
import { Form, Input, message } from "antd";
import { useDispatch } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FacebookOutlined, TwitterOutlined, InstagramOutlined } from "@ant-design/icons";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //form handler
  const onfinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axios.post("/api/v1/user/login", values);
      window.location.reload();
      dispatch(hideLoading());
      if (res.data.success) {
        localStorage.setItem("token", res.data.token);
        message.success("Login Successfully");
        navigate("/");
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      message.error("something went wrong");
    }
  };
  return (
    <div className="auth-main-container">
      <div className="auth-box">
        <div className="auth-left">
          <div className="form-container">
            <Form
              layout="vertical"
              onFinish={onfinishHandler}
              className="register-form"
            >
              <div className="logo-container">
                <h4>Quick Medi</h4>
              </div>
              
              <h3 className='text-center'>Hello, <br/><span className="welcome-text">Welcome!</span></h3>
              <Form.Item label="Email" name="email">
                <Input type="email" placeholder="name@mail.com" required />
              </Form.Item>
              <Form.Item label="Password" name="password">
                <Input type="password" placeholder="••••••••••••" required />
              </Form.Item>
              <div className="form-bottom">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <Link to="/forgot-password">Forgot password?</Link>
              </div>
              <div className="button-group">
                <button className="btn btn-primary" type="submit">
                  Login
                </button>
                <Link to="/register" className="btn btn-outline">
                  Sign up
                </Link>
              </div>
              <div className="divider"><span>or</span></div>
              <div className="social-login-options">
                <button className="social-btn google-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="social-icon"/> Login with Google</button>
                <button className="social-btn facebook-btn"><img src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" alt="Facebook" className="social-icon"/> Login with Facebook</button>
              </div>
              <div className="social-links">
                <span>FOLLOW</span>
                <a href="#"><FacebookOutlined /></a>
                <a href="#"><TwitterOutlined /></a>
                <a href="#"><InstagramOutlined /></a>
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