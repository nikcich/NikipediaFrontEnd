import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(Cookies.get('nikipedia_auth') ?? false);
    const navigate = useNavigate();

    useEffect(() => {
        const authCookie = Cookies.get('nikipedia_auth');
        if (authCookie) {
            setIsAuthenticated(Cookies.get('nikipedia_auth'));
        } else {
            Cookies.remove('nikipedia_auth');
            setIsAuthenticated(false);
            navigate('/logout');
        }
    }, []);

    return isAuthenticated;
}

export default useAuth;
