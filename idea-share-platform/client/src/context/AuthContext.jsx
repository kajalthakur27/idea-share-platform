import { createContext, useState, useEffect } from 'react';

// Context banate hain - isse poore app me user ka data access kar sakte hain
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Component load hone pe localStorage se user data load karo
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    
    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch (error) {
        console.error('Error loading stored user:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  // Login function - user data aur token save karta hai
  const login = (userData, userToken) => {
    // Validate user data
    if (!userData || !userToken) {
      console.error('Invalid login data provided');
      return false;
    }

    // Ensure required fields are present
    if (!userData._id || !userData.email) {
      console.error('Missing required user fields');
      return false;
    }

    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    console.log('User logged in:', userData.email);
    return true;
  };

  // Logout function - sab clear kar deta hai
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    console.log('User logged out');
  };

  // Check karo ki user logged in hai ya nahi
  const isAuthenticated = () => {
    return !!(token && user && user._id);
  };

  const value = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
