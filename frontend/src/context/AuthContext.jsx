// src/context/AuthContext.jsx

import { createContext, useEffect, useState } from "react";
import service from "../services/service";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);// here need to false but for check i make it true
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      service
        .validateToken(token)
        .then((response) => {
          if (response.valid) {
            setUser(response);
            console.log(response.id, "this is id from authContext");
            console.log(response.fullName,"this is fullname from authContext")
            setIsAuthenticated(true);
          }
        })
        .catch(() => {
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  },[]);

  

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

  