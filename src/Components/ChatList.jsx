import { Card, Heading, Spinner, Text } from "@chakra-ui/react";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function (props) {
    const { socket, setSelected, setSelectedData } = props;
    const [chats, setChats] = useState(null);
    const [loading, setLoading] = useState(false);

    const getChats = async () => {
        console.log("Getting chats");
        setLoading(true);
        const response = await axios.post('http://localhost:5000/getchats', { sessionId: Cookies.get('sessionId') }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response?.data?.chats) {
            setChats(response.data.chats);
        }
        setLoading(false);
    }

    const handleSelectChat = (id, data) => {
        setSelected(id);
        setSelectedData(data);
    }

    useEffect(() => {
        getChats();
    }, [socket]);

    return (
        <>
            <Heading mb={2}>Chats</Heading>
            {(chats == null || loading) ? <Spinner size="lg" /> :
                <div>
                    {chats.map((chat, idx) => {
                        return (
                            <Card className="chatCard" onClick={() => handleSelectChat(chat.chatId, chat)} background={"rgba(0,0,0,0.15)"} p={3} m={1} key={chat.chatId}>
                                <Heading size={"md"}>{chat.name}</Heading>
                                <Text>{chat.lastUpdate}</Text>
                            </Card>
                        )
                    })}
                </div>
            }
        </>
    );
}