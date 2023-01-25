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
import About from './Components/About';
import { useEffect, useState } from 'react';
import { useContext, createContext } from 'react';
import LoggingOut from './Components/LoggingOut';

export const LoggedInContext = createContext(null);

function App() {

  const location = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedIn] = useState(false);

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

  useEffect(() => {
    console.log("Rendering here...");
  })

  return (
    <div className="App">
      <LoggedInContext.Provider value={isLoggedin}>
        <AnimatePresence mode="sync" initial={false}>
          <Button key="b" onClick={() => handleNavigate()}>Click to Toggle Pages</Button>
          <Routes key="c">
            <Route exact path="/" element={<h1>Home Page</h1>} />
            <Route path="/login" element={<LogInPage anims={anim} setLoggedIn={setIsLoggedIn} />} />
            <Route path="/about" element={<About anims={anim} />} />
            <Route path="/home" element={<About anims={anim} />} />
            <Route path="/logout" element={<LoggingOut setLoggedIn={setIsLoggedIn} />} />
          </Routes>
        </AnimatePresence>
      </LoggedInContext.Provider>
    </div>
  );
}

export default App;
