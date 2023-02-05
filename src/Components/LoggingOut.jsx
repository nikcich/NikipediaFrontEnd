import { useEffect } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { Spinner, Heading } from "@chakra-ui/react";

const LoggingOut = () => {
    const navigate = useNavigate();

    useEffect(() => {
        setTimeout(() => {
            Cookies.remove("sessionId");
            navigate("/login");
        }, 1000);
    }, []);

    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%', flexDirection: 'column', gap: '2rem' }}>
            <Spinner />
            <Heading>Logging you out...</Heading>
        </div>
    );
};

export default LoggingOut;
