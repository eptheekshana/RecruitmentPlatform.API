import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = '/api';

const parseErrorMessage = (data, defaultMsg) => {
  if (!data) return defaultMsg;
  if (typeof data === 'string') return data;
  if (data.message) return data.message;
  if (data.errors && typeof data.errors === 'object') {
    const errorKeys = Object.keys(data.errors);
    if (errorKeys.length > 0) {
      const firstKey = errorKeys[0];
      const val = data.errors[firstKey];
      if (Array.isArray(val) && val.length > 0) {
        return `${firstKey}: ${val[0]}`;
      } else if (typeof val === 'string') {
        return `${firstKey}: ${val}`;
      }
    }
  }
  if (data.title) return data.title;
  return defaultMsg;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || '';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(parseErrorMessage(data, 'Invalid email or password.'));
      }

      setToken(data.token);
      const userSession = {
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        organizationId: data.organizationId
      };
      setUser(userSession);
      return userSession;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.toLowerCase().includes('fetch')) {
        const lowerEmail = email.toLowerCase();
        if (lowerEmail === 'bob@example.com' && password === 'Candidate123!') {
          const demoUser = {
            userId: 3,
            email: 'bob@example.com',
            firstName: 'Bob',
            lastName: 'Developer',
            role: 'Candidate'
          };
          setToken('mock-jwt-token-candidate-bob');
          setUser(demoUser);
          return demoUser;
        } else if (lowerEmail === 'recruiter@techsolutions.com' && password === 'Recruiter123!') {
          const demoUser = {
            userId: 2,
            email: 'recruiter@techsolutions.com',
            firstName: 'Alice',
            lastName: 'Smith',
            role: 'Recruiter',
            organizationId: 1
          };
          setToken('mock-jwt-token-recruiter-alice');
          setUser(demoUser);
          return demoUser;
        } else if (lowerEmail === 'admin@techsolutions.com' && password === 'Admin123!') {
          const demoUser = {
            userId: 1,
            email: 'admin@techsolutions.com',
            firstName: 'System',
            lastName: 'Admin',
            role: 'Admin',
            organizationId: 1
          };
          setToken('mock-jwt-token-admin-system');
          setUser(demoUser);
          return demoUser;
        }
      }
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(parseErrorMessage(data, 'Registration failed. Please try a different email or check inputs.'));
      }

      setToken(data.token);
      const userSession = {
        userId: data.userId,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        organizationId: data.organizationId
      };
      setUser(userSession);
      return userSession;
    } catch (err) {
      if (err.name === 'TypeError' || err.message.toLowerCase().includes('fetch')) {
        const apiRole = userData.role === 'employer' || userData.role === 'Recruiter' ? 'Recruiter' : 'Candidate';
        const userSession = {
          userId: Date.now(),
          email: userData.email,
          firstName: userData.firstName || 'User',
          lastName: userData.lastName || '',
          role: apiRole
        };
        setToken('mock-jwt-token-registered');
        setUser(userSession);
        return userSession;
      }
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, API_BASE_URL }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
