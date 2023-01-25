import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../App";
import useAuth from '../Hooks/useAuth';

const About = (props) => {

    const isLoggedIn = useContext(LoggedInContext);
    const navigate = useNavigate();
    const isAuthenticated = useAuth();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login");
        }
    }, [isLoggedIn]);


    return (
        <motion.div
            className="FullPageDiv"
            {...props.anims}
        >
            <h1>Abooutt</h1>
        </motion.div>
    );
}

export default About;