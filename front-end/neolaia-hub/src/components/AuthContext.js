import React, { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { base_url } from '../api';
import { jwtDecode } from 'jwt-decode';
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); 
    const [authMode, setAuthMode] = useState(null);
    const [shibbolethLoginUrl, setShibbolethLoginUrl] = useState(null);
    const [authError, setAuthError] = useState(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.hash.slice(1));
        const returnedToken = params.get('shibboleth_token');
        if (returnedToken) {
            window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
        }
        axios.get(`${base_url}neolaia-usr/auth-config`)
          .then(({ data }) => {
            if (!['otp', 'shibboleth'].includes(data.mode)) throw new Error('Invalid authentication mode');
            setAuthMode(data.mode);
            setShibbolethLoginUrl(data.shibbolethLoginUrl || `${base_url}neolaia-usr/shibboleth/login`);
            const candidate = returnedToken || localStorage.getItem('token');
            if (candidate) {
                try {
                    const claims = jwtDecode(candidate);
                    if (claims.exp * 1000 > Date.now() && (claims.auth_source || 'otp') === data.mode) {
                        setToken(candidate);
                        localStorage.setItem('token', candidate);
                    } else {
                        localStorage.removeItem('token');
                    }
                } catch (_) {
                    localStorage.removeItem('token');
                }
            }
          })
          .catch(() => setAuthError('Authentication is temporarily unavailable. Please try again later.'))
          .finally(() => setLoading(false));
    }, []);
  
    return (
      <AuthContext.Provider value={{ token, setToken, loading, authMode, authError, shibbolethLoginUrl }}>
        {children}
      </AuthContext.Provider>
    );
  };
