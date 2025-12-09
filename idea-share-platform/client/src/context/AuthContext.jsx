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
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Login function - user data aur token save karta hai
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
  };

  // Logout function - sab clear kar deta hai
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Check karo ki user logged in hai ya nahi
  const isAuthenticated = () => {
    return !!token;
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
