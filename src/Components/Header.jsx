import { Heading, Spacer, Flex, Avatar, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";


function Header(props) {

    return (
        <>
            <Flex style={{ width: '100vw', background: 'rgba(0,0,0,0.2)' }}>
                <Heading m={2}>Nikipedia</Heading>
                <Spacer />

                    <Avatar name='Qball' src={''} m={2} textAlign='center' />


            </Flex>
        </>
    );
}

export default Header;