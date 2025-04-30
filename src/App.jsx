import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import InitConnection from "./connection";
import WebSocketConnection from "./websocket-connect";
import Market from "./market";
import SignIn from "./signin/page";

export default function App() {
  return (
    
        <Router>
          <Routes>
            <Route path="/" element={<>
              <InitConnection />
              <WebSocketConnection />
              <Market />
          
            </>} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
        </Router>
  );
}
