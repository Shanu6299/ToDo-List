import React from 'react';
import "../styles/RegisterStyles.css";
import { Form, Input, message } from 'antd';
import axiosInstance from '../utils/axiosConfig';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { showLoading, hideLoading } from '../redux/features/alertSlice';

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onFinishHandler = async (values) => {
    try {
      dispatch(showLoading());
      const res = await axiosInstance.post('/api/auth/register', values);
      dispatch(hideLoading());
      if (res.data.success) {
        // Don't store token here, just show success message and redirect to login
        message.success('Registration Successful!');
        navigate('/login');
      } else {
        message.error(res.data.message || 'Registration failed');
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error(error.response?.data?.message || 'Something went wrong!');
      console.error('Registration error:', error);
    }
  };
  return (
    <div className="auth-main-container">
      <div className="auth-box">
        <div className="auth-left">
          <div className='form-container'>
            <Form layout="vertical" onFinish={onFinishHandler} className='register-form'>
              <div className="logo-container">
                <h3 className='text-center'>Hello, <br/><span className="welcome-text">Welcome!</span></h3>
              </div>
              <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter your name' }]}> <Input /> </Form.Item>
              <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Please enter your email' }]}> <Input type="email" /> </Form.Item>
              <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please enter your password' }]}> <Input.Password /> </Form.Item>
              <div className="button-group">
                <button className="btn btn-primary" type="submit">Register</button>
              </div>
              <div style={{ marginTop: 16 }}>
                Already have an account? <Link to="/login">Login</Link>
              </div>
            </Form>
          </div>
        </div>
        <div className="auth-right">
          <div className="auth-image-bg">
            <img src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&q=80" alt="Register Visual" className="auth-image" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Register;
