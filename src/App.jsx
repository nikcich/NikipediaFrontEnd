import './App.css';

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate
} from "react-router-dom";

import { AnimatePresence } from 'framer-motion';
import { Button } from '@chakra-ui/react';
import LogInPage from './Components/LogInPage';
import Home from './Components/Home';
import { useEffect, useState } from 'react';
import LoggingOut from './Components/LoggingOut';
import axios from 'axios';
import Cookies from 'js-cookie';

function App() {

  const location = useLocation();
  const navigate = useNavigate();

  const mass = 0.5;
  const damping = 10;
  const bounce = 0.25;

  const anim = {
    initial: {
      x: "2000px",
    },
    animate: {
      x: '0px',
    },
    transition: {
      duration: 1,
      type: 'spring',
      bounce: bounce,
      mass: mass,
      damping: damping,
    },
    exit: {
      x: '-2000px',
      transition: {
        duration: 1,
        type: 'spring',
        bounce: bounce,
        mass: mass,
        damping: damping,
      }
    },
  }


  const handleNavigate = () => {
    if (location.pathname == '/login') {
      navigate('/about');
    } else {
      navigate('/login');
    }
  }


  return (
    <div className="App">

      <AnimatePresence mode="sync" initial={false}>
        <Routes key="c">
          <Route exact path="/" element={<LoggingOut />} />
          <Route path="/login" element={<LogInPage anims={anim} />} />
          <Route path="/home" element={<Home anims={anim} />} />
          <Route path="/logout" element={<LoggingOut />} />
        </Routes>
      </AnimatePresence>
    </div>
  );
}

export default App;
