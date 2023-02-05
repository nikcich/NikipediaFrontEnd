import { useState, useContext, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { LoggedInContext } from "../App";
import Header from './Header';
import Cookies from 'js-cookie';
import io from 'socket.io-client';
import { Spacer } from '@chakra-ui/react';
import ChatList from './ChatList';
import ChatDisplay from './ChatDisplay';

const Home = () => {
    const navigate = useNavigate();
    const isLoggedIn = Cookies.get("sessionId") || false;
    const [socket, setSocket] = useState(null);
    const [selectedChat, setSelected] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/logout");
        }

        const newSocket = io('ws://localhost:5000');
        setSocket(newSocket);

        newSocket.emit('session-link', Cookies.get("sessionId"));

        newSocket.on('Hello', (arg) => {
            console.log("world");
        });

        return () => {
            newSocket.disconnect();
        };
    }, [isLoggedIn]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
            <Header />

            <div style={{ height: '100%', width: '100%', display: 'flex' }}>
                {!socket ? <h1>Loading ...</h1>
                    :
                    <>
                        <div style={{ height: '100%', width: '20%', minWidth: '300px', background: 'rgba(0,0,0, 0.2)' }}>
                            <ChatList socket={socket} setSelected={setSelected} setSelectedData={setSelectedData} />
                        </div>
                        <div style={{ height: '100%', width: '100%' }}>
                            <ChatDisplay socket={socket} selectedChat={selectedChat} selectedData={selectedData} />
                        </div>
                    </>
                }
            </div>
        </div>
    );
};

export default Home;
