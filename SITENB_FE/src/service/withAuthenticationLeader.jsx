import React from 'react';
import { Navigate } from 'react-router-dom';

// withAuthenticationLeader.jsx
const withAuthenticationLeader = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('Token:', token);
    console.log('Role:', role);

    if (!token || token === "") {
      return <Navigate to="/login" />;
    }

    if (role !== "kepala_subbag") {
      return <Navigate to="/" />; // Atau rute lain yang sesuai
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuthenticationLeader;
