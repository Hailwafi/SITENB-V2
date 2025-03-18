import React from 'react';
import { Navigate } from 'react-router-dom';

// withAuthenticationStaff.jsx
const withAuthenticationStaff = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('Token:', token);
    console.log('Role:', role);

    if (!token || token === "") {
      return <Navigate to="/login" />;
    }

    if (role !== "staff") {
      return <Navigate to="/" />; // Atau rute lain yang sesuai
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default withAuthenticationStaff;
