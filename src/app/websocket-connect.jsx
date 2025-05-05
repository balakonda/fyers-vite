"use client";
import React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Box from "@mui/material/Box";
import ButtonGroup from "@mui/material/ButtonGroup";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";

export default function WebSocketConnection() {
  const [connectionStatus, setConnectionStatus] = useState(false);
  const [volDays, setVolDays] = useState(10);

  const connectToWebSocket = async () => {
    const newAccessToken = localStorage.getItem("access_token");
    const response = await fetch("http://localhost:5000/api/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ accessToken: newAccessToken }),
    });

    const result = await response.json();
    console.log(result.message);

    // Check connection status immediately after connecting
    testConnection();
  };

  const testConnection = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/test");
      const result = await response.json();
      setConnectionStatus(result.message);
    } catch (error) {
      console.error("Error testing connection:", error);
      setConnectionStatus(false);
    }
  };

  const disconnectWebSocket = async () => {
    const response = await fetch("http://localhost:5000/api/disconnect");
    const result = await response.json();
    console.log(result.message);
    setConnectionStatus(false);
  };

  const getHistory = async () => {
    const response = await fetch(`http://localhost:5000/api/get-history?days=${volDays}`);
    const result = await response.json();
    console.log(result.message);
    if(result.data){
      localStorage.setItem("history", JSON.stringify(result.data));
    }
  };

  const getAllHistory = async () => {
    const response = await fetch("http://localhost:5000/api/get-all-history");
    const result = await response.json();
    console.log(result);
    if(result.data){
      localStorage.setItem("allHistory", JSON.stringify(result.data));
    }
  };

  // /get-volume-file-history
  const getVolumeFileHistory = async () => {
    const response = await fetch("http://localhost:5000/api/get-volume-file-history");
    const result = await response.json();
    console.log(result);
    if(result.data){
      localStorage.setItem("volumeFileHistory", JSON.stringify(result.data));
    }
  };

  const handleVolDaysChange = (event) => {
    setVolDays(event.target.value);
    localStorage.setItem("volDays", event.target.value);
  };

  useEffect(() => {
    // Test connection when component mounts
    testConnection();

    // Set up interval to check connection every 30 seconds
    const intervalId = setInterval(() => {
      testConnection();
    }, 30000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <ButtonGroup variant="outlined" aria-label="Basic button group">
        <Button
          onClick={() => {
            connectToWebSocket();
          }}
        >
          Get Fyers WebSocket
        </Button>
        <Button onClick={testConnection}>Test Connection</Button>
        <Button onClick={disconnectWebSocket}>Disconnect WebSocket</Button>
        <Button onClick={getHistory}>Get History</Button>
        <Button onClick={getAllHistory}>Get All History</Button>
        <Button onClick={getVolumeFileHistory}>Get Volume File History</Button>
        <Input type="number" value={volDays} onChange={handleVolDaysChange} />
      </ButtonGroup>
      <Typography
        variant="body1"
        sx={{
          color: connectionStatus ? "success.main" : "error.main",
          fontWeight: "bold",
          fontSize: "1.2rem",
        }}
      >
        {connectionStatus ? "Connected" : "Disconnected"}
      </Typography>
    </Stack>
  );
}
