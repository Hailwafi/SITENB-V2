// withAuthenticationAdmin.jsx
const withAuthenticationAdmin = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    console.log('Token:', token);
    console.log('Role:', role);

    if (!token || token === "") {
      return <Navigate to="/login" />;
    }

    if (role !== "admin") {
      return <Navigate to="/" />; // Atau rute lain yang sesuai
    }

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};
export default withAuthenticationAdmin;

