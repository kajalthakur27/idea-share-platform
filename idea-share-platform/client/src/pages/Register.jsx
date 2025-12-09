import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { registerUser } from '../utils/api';
import { toast } from 'react-toastify';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('Please fill all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Password length check
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Password match check karo
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      // Register data prepare karo
      const registerData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      console.log('Register attempt with:', { name: registerData.name, email: registerData.email });

      // Register API call
      const data = await registerUser(registerData);

      console.log('Registration successful, response:', data);

      // Validate response data
      if (!data || !data._id || !data.token) {
        toast.error('Invalid response from server');
        return;
      }

      // Registration successful - automatically login kar do
      const loginSuccess = login({ 
        _id: data._id, 
        name: data.name, 
        email: data.email 
      }, data.token);

      if (loginSuccess) {
        toast.success('Registration successful!');
        setFormData({ 
          name: '', 
          email: '', 
          password: '', 
          confirmPassword: '' 
        }); // Form reset karo
        navigate('/dashboard');
      } else {
        toast.error('Failed to save registration data');
      }
    } catch (error) {
      console.error('Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      
      // Better error messages
      if (errorMessage.includes('already exists')) {
        toast.error('Email already registered! Please login instead.');
        // Optional: Auto-redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-left">
          <h1>Join Us Today!</h1>
          <p className="auth-quote">"Start sharing your innovative ideas"</p>
        </div>

        <div className="auth-right">
          <div className="auth-card">
            <h2>Create Account</h2>
            <p className="auth-subtitle">Join the idea sharing platform</p>

            {/* Helper message */}
            <div className="info-box">
              <p>📧 New user? Create your account here</p>
              <p>Already registered? <Link to="/login">Login here</Link></p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>

              <button 
                type="submit" 
                className="btn-primary"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <p className="auth-switch">
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
