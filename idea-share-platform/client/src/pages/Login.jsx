import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { loginUser } from '../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Input field change hone pe state update karo
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form submit hone pe
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation - fields empty to nahi
    if (!formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      // Validation - data check kar lo
      const loginData = {
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('Login attempt with:', loginData);
      
      // API call karke login karo
      const data = await loginUser(loginData);
      
      console.log('Login successful, response:', data);
      
      // Login successful - token aur user data save karo
      login({ _id: data._id, name: data.name, email: data.email }, data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Left side - Blue gradient with quote */}
        <div className="auth-left">
          <h1>Welcome Back!</h1>
          <p className="auth-quote">"Every big idea starts with a small step"</p>
        </div>

        {/* Right side - Login form */}
        <div className="auth-right">
          <div className="auth-card">
            <h2>Login to Your Account</h2>
            <p className="auth-subtitle">Share your ideas with the world</p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <p className="auth-switch">
              Don't have an account? <Link to="/register">Sign up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
