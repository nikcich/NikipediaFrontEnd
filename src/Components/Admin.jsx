import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuItemOption,
    MenuGroup,
    MenuOptionGroup,
    MenuDivider, Button,

    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Heading, Input
} from '@chakra-ui/react';

import axios from 'axios';
import Cookies from 'js-cookie';

import { useDisclosure } from '@chakra-ui/react';
import { useRef, useState } from 'react';

export default function (props) {
    const { userId, selectedData } = props;
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [action, setAction] = useState('');
    const username = useRef();

    const handleConfirm = async () => {
        let url = action == "Add" ? 'adduser' : 'banuser';

        const response = await axios.post('http://localhost:5000/' + url, {
            sessionId: Cookies.get('sessionId'), chatId: selectedData.chatId, username: username.current.value
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    return (
        <>
            <Menu>
                <MenuButton as={Button}>
                    Admin Actions
                </MenuButton>
                <MenuList>
                    <MenuItem onClick={() => { onOpen(); setAction("Add"); }}>Add User</MenuItem>
                    <MenuItem onClick={() => { onOpen(); setAction("Ban"); }}>Ban User</MenuItem>
                </MenuList>
            </Menu>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Admin Panel</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Heading>{action} User</Heading>
                        <Input placeholder='Username' mt={1} ref={username} />
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='blue' mr={3} onClick={() => { handleConfirm(); onClose(); }}>
                            Confirm
                        </Button>
                        <Button variant='ghost' onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}