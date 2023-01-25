import { motion } from "framer-motion";
import { LoggedInContext } from "../App";
import {
    Button, Card, CardBody, CardFooter, CardHeader,
    Heading, Spacer, Stack, Input, InputGroup,
    InputRightElement, Flex
} from "@chakra-ui/react";
import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';


const LogInPage = (props) => {

    const { anims, setLoggedIn } = props;
    const [show, setShow] = useState(false);
    const [signUp, setSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const isLoggedIn = useContext(LoggedInContext);

    const [errorMessage, setErrorMessage] = useState('');

    const LogInUsername = useRef();
    const LogInPassword = useRef();

    const SignUpUsername = useRef();
    const SignUpPassword = useRef();
    const SignUpConfirmPassword = useRef();
    const SignUpEmail = useRef();

    const handleShow = () => setShow(!show);

    const handleLogIn = () => {
        setLoading(true);

        setTimeout(() => {
            const POST_DATA = {
                type: signUp ? 1 : 0,
                username: signUp ? SignUpUsername.current.value : LogInUsername.current.value,
                password: signUp ? SignUpPassword.current.value : LogInPassword.current.value,
                confirmPassword: SignUpConfirmPassword.current.value,
                email: SignUpEmail.current.value,
            }

            axios.post('http://localhost:8080/login', POST_DATA)
                .then((response) => {
                    if (response.data?.error === 'true') {
                        setErrorMessage(response.data.errorMessage);
                        return;
                    }

                    if (!response.data?.cookie) {
                        setErrorMessage("Error: Invalid Server Response");
                        return;
                    }

                    const expires = new Date();
                    expires.setTime(expires.getTime() + (60 * 60 * 1000)); // 1 hour from login
                    Cookies.set('nikipedia_auth', response.data.cookie, { expires: expires });

                    setLoggedIn(true);
                    navigate("/home");

                })
                .catch((error) => {
                    console.log(error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }, 500);
    }

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         //navigate("/home");
    //     }
    // }, [isLoggedIn]);



    return (
        <motion.div
            className="FullPageDiv"
            style={{ position: 'relative' }}
            {...anims}
        >

            <motion.div animate={signUp ? { width: 0 } : {}} transition={signUp ? {} : { delay: 1 }} style={{
                overflow: 'hidden', width: '100%',
                height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: "absolute", top: 0
            }}>
                <Card ml={5} mr={5} maxW={"90vw"} w={"500px"} h={"550px"}>
                    <CardHeader>
                        <Heading size='lg' textTransform='uppercase'>Log In To Nikipedia</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack spacing={10}>
                            <Input variant='filled' placeholder='Username' ref={LogInUsername} />
                            <InputGroup size='md'>
                                <Input
                                    variant='filled'
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    ref={LogInPassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleShow} variant='outline'>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Stack>
                    </CardBody>

                    <CardFooter ml={5} mr={5}>
                        <Stack spacing={1} style={{ width: '100%' }}>
                            <Flex>
                                <Button variant='solid' colorScheme='blue' w="150px" onClick={() => handleLogIn()}
                                    isLoading={loading}
                                    loadingText='Logging In'
                                >
                                    Log In
                                </Button>
                                <Spacer />
                                <Button variant='outline' colorScheme='blue' w="150px" onClick={() => setSignUp((old) => !old)}>
                                    Sign Up
                                </Button>

                            </Flex>
                            <h6 style={{ color: 'firebrick', fontWeight: 'bold' }}>{errorMessage}</h6>
                        </Stack>
                    </CardFooter>
                </Card>
            </motion.div>



            {/* Below is the Sign Up Form, Above is LogIn */}



            <motion.div animate={signUp ? {} : { width: 0 }} transition={signUp ? { delay: 1 } : {}} style={{
                overflow: 'hidden', width: '100%', height: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: "absolute", top: 0
            }}>
                <Card ml={5} mr={5} maxW={"90vw"} w={"500px"} h={"550px"}>
                    <CardHeader>
                        <Heading size='lg' textTransform='uppercase'>Create an Account for Nikipedia</Heading>
                    </CardHeader>

                    <CardBody>
                        <Stack spacing={10}>
                            <Input variant='filled' placeholder='Email' ref={SignUpEmail} />
                            <Input variant='filled' placeholder='Username' ref={SignUpUsername} />
                            <InputGroup size='md'>
                                <Input
                                    variant='filled'
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Enter password'
                                    ref={SignUpPassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleShow} variant='outline'>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>

                            <InputGroup size='md'>
                                <Input
                                    variant='filled'
                                    pr='4.5rem'
                                    type={show ? 'text' : 'password'}
                                    placeholder='Confirm password'
                                    ref={SignUpConfirmPassword}
                                />
                                <InputRightElement width='4.5rem'>
                                    <Button h='1.75rem' size='sm' onClick={handleShow} variant='outline'>
                                        {show ? 'Hide' : 'Show'}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </Stack>
                    </CardBody>

                    <CardFooter ml={5} mr={5}>
                        <Button variant='solid' colorScheme='blue' w="150px" onClick={() => handleLogIn()}
                            isLoading={loading}
                            loadingText='Submitting'
                        >
                            Create Account
                        </Button>
                        <Spacer />
                        <Button variant='outline' colorScheme='blue' w="150px" onClick={() => setSignUp((old) => !old)}>
                            Log In
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>



        </motion.div>
    );
}

export default LogInPage;