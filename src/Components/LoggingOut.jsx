import { useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

function LoggingOut(props) {

    const { setLoggedIn } = props;
    const navigate = useNavigate();

    useEffect(() => {
        Cookies.remove('nikipedia_auth');
        setLoggedIn(false);
        navigate('/login');
    }, []);

    return (
        <>
            <h1>Logging you out...</h1>
        </>
    )
}

export default LoggingOut;