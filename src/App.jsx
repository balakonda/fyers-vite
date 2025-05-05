import * as React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import InitConnection from './app/connection'
import WebSocketConnection from './app/websocket-connect'
import Market from './app/market'
import SignIn from './app/signin/page'
import Binance from './app/binance/page'

export default function App() {
  return (
    <Container maxWidth="full">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <InitConnection />
                <WebSocketConnection />
                <Market />
              </>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/binance" element={<Binance />} />
        </Routes>
      </Router>
    </Container>
  )
}
