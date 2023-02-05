import { Heading, Spinner, Button } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import Message from "./Message";
import axios from "axios";
import Cookies from "js-cookie";
import Admin from "./Admin";


export default function (props) {

    const { socket, selectedChat, selectedData } = props;
    const messageScrollContainer = useRef();
    const input = useRef();
    const [listening, setListening] = useState([]);
    const [messages, setMessages] = useState(null);
    const [initialFetch, setInitial] = useState(false);
    const [page, setPage] = useState(1);
    const [userId, setUserId] = useState(null);
    const [loading, setLoading] = useState(true);

    const getOriginalMessages = async (pg, override) => {
        let reqLen = messages?.length ?? 0;
        const response = await axios.post('http://localhost:5000/getmessages', { sessionId: Cookies.get('sessionId'), chat: selectedChat, page: pg, current: override ? 0 : messages?.length ?? 0 }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        setMessages((old) => {
            setLoading(false);
            if (override) {
                return (response.data.messages);
            }

            if (old?.length == reqLen || old == null) {
                return [...(old ?? []), ...response.data.messages];
            } else {
                return [...(old ?? [])];
            }
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        socket.emit('message', { session: Cookies.get('sessionId'), chatId: selectedChat, content: input.current.value });
        input.current.value = '';
    }

    const handleLoadMore = () => {
        setLoading(true);
        let tm = messages.length;
        getOriginalMessages(page + 1);

        if (20 * (page) <= tm)
            setPage((old) => old + 1);
    }

    const leaveChat = async () => {
        const response = await axios.post('http://localhost:5000/leavechat', {
            sessionId: Cookies.get('sessionId'), chatId: selectedData.chatId, userId: userId
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }


    useEffect(() => {
        console.log(selectedData);
        if (messages?.length > 0 && selectedChat !== messages[0].chatId) {
            setLoading(true);
            setMessages([]);
            getOriginalMessages(1, true);
        }

        setListening((old) => [...old, selectedChat]);

        socket.on(selectedChat, (a) => {
            setMessages((old) => [a, ...(old ?? [])]);
        });

        socket.on('whoareyou', (msg) => {
            setUserId(msg);
        });

        socket.emit('whoami', '');

        if (selectedChat && initialFetch == false) {
            setInitial(true);
            getOriginalMessages(1);
        }

        return () => {
            for (let i of listening) {
                socket.off(i);
            }
        }
    }, [selectedChat, messages]);

    return (
        <>
            {selectedChat ?? false ?
                (
                    <form style={{ height: '100%', width: '100%' }} onSubmit={handleSubmit}>
                        <div style={{
                            height: '100px', width: '100%', background: 'rgba(0,0,0, 0.4)',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '1rem'
                        }}>
                            <Heading>{selectedData?.name}</Heading>

                            <div>
                                <Button mr={2} colorScheme='pink'>Leave Chat</Button>
                                {userId && selectedData?.admins.includes(userId) &&
                                    <Admin userId={userId} selectedData={selectedData} />
                                }
                            </div>

                        </div>

                        <div ref={messageScrollContainer} style={{
                            width: '100%', overflowX: 'hidden',
                            height: 'calc(100vh - 230px)', display: 'flex', flexDirection: 'column-reverse', gap: '0.1rem',

                        }}>

                            {initialFetch ?
                                <>
                                    {messages != null && messages.map((msg, idx) => {

                                        return (
                                            <Message
                                                key={msg._id + idx} kind={msg.kind ?? userId == msg.sender} content={msg.content} senderId={msg.sender}
                                                timestamp={msg.timestamp} sender={msg.senderName} previous={idx < messages.length - 1 ? messages[idx + 1] : null}
                                            />
                                        )
                                    })}

                                    {loading ?
                                        <>
                                            <div className="messageContainer" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Spinner size={"xl"} />
                                            </div>

                                        </> :
                                        <>
                                            <div className="messageContainer" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                                <Button colorScheme='teal' size='lg' onClick={handleLoadMore} style={{ fontWeight: 'bolder' }}>Load Messages</Button>
                                            </div>

                                        </>
                                    }
                                </>
                                :
                                <>
                                    <div className="messageContainer" style={{ alignItems: 'center', justifyContent: 'center' }}>
                                        <Spinner size={"xl"} />
                                    </div>
                                </>
                            }

                            { }

                        </div>

                        <input ref={input} type="text" placeholder="Enter a message" style={{
                            height: '50px', width: 'calc(100% - 1rem)', borderRadius: '5rem', padding: '10px',
                            margin: '0.5rem',
                        }}></input>
                        <input style={{ display: 'none' }} type="submit" />
                    </form>
                )
                : <Heading>No Chat Selected</Heading>
            }

        </>
    );
}