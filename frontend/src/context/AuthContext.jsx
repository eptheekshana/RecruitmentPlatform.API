import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const API_BASE_URL = 'http://localhost:5128/api';

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
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Authentication failed.');
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
  };

  const register = async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Registration failed.');
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
