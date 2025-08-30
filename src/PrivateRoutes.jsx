import { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AppContext } from './AppContext';

const PrivateRoutes = () => {
    let { loggedIn } = useContext(AppContext);
    const isAuthenticated = loggedIn;
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;