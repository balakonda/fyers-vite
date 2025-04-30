"use client";
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import InitConnection from "./connection";
import WebSocketConnection from "./websocket-connect";
import Market from "./market";
export default function Home() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer components={["DateTimePicker"]}>
        <div className="">
          <main className="">
            <InitConnection />
            <WebSocketConnection />
            <Market />
          </main>
        </div>
      </DemoContainer>
    </LocalizationProvider>
  );
}
