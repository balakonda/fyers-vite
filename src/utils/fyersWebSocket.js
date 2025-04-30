"use client";
import { fyersDataSocket } from "fyers-web-sdk-v3";
import { NIFTY_200_LIST } from "../components/data";
const accessToken = localStorage.getItem("access_token");
const clientId = process.env.NEXT_PUBLIC_FYERS_APP_ID; // Replace with your client ID
const symbol = "NSE:DMART-EQ";
let fyersWS;

const STOCK_LIST = NIFTY_200_LIST.slice(0, 10).map((symbol) => `NSE:${symbol}-EQ`);
function getFyersWebSocket() {
  // const fyersSocket = new fyersOrderSocket(accessToken);

  // // Define connection event handlers
  // fyersSocket.onOpenCallback = () => {
  //   console.log("✅ Connected to Fyers Trade WebSocket");

  //   // Subscribe to order, position, and trade updates
  //   fyersSocket.subscribe(["trades"]);
  // };

  // fyersSocket.onMessageCallback = (data) => {
  //   console.log("📩 Trade Update:", data);

  //   // Handle order updates
  //   if (data.T === "t" && data.k === "orders") {
  //     console.log("✅ Order Update:", data.d);
  //   }

  //   // Handle position updates
  //   if (data.T === "t" && data.k === "positions") {
  //     console.log("📊 Position Update:", data.d);
  //   }

  //   // Handle trade updates
  //   if (data.T === "t" && data.k === "trades") {
  //     console.log("🔄 Trade Execution Update:", data.d);
  //   }
  // };

  // fyersSocket.onErrorCallback = (error) => {
  //   console.error("❌ WebSocket Error:", error);
  // };

  // fyersSocket.onCloseCallback = () => {
  //   console.log("❌ Fyers WebSocket Disconnected");
  // };

  fyersWS = new fyersDataSocket(`${clientId}:${accessToken}`);

  fyersWS.on("connect", () => {
    console.log("WebSocket connected successfully!");

    // Subscribe to NSE:DMART-EQ
    // Subscribe to trades for NSE:DMART-EQ
    // fyersWS.subscribe(["trades", NIFTY_200_LIST.slice(0, 5).map((symbol) => `NSE:${symbol}-EQ`)]);
    fyersWS.subscribe(STOCK_LIST);
    // fyersWS.mode(fyersWS.FullMode, 1);
    console.log(fyersWS.isConnected());
    console.log(`Subscribed to ${symbol}`);
  });

  fyersWS.on("trades", (data) => {
    console.log("Trade data received:", data);

    if (data && data.hasOwnProperty("s") && data["s"] === "ok" && data["trades"]) {
    }
  });

  // Event when data is received
  fyersWS.on("general", (data) => {
    console.log("Data received:", data);
  });

  // Handle errors
  fyersWS.on("error", (error) => {
    console.error("WebSocket error:", error);
    // dataDiv.innerHTML = "Error connecting to WebSocket!";
  });
  // fyersWS.on("message", function (message) {
  //   console.log({ TEST: message });
  // });

  // Handle WebSocket close
  fyersWS.on("close", () => {
    console.log("WebSocket disconnected.");
    // dataDiv.innerHTML = "Disconnected from Fyers WebSocket.";
  });

  // Start the socket connection.
  fyersWS.connect();
  fyersWS.autoreconnect(5);

  return fyersWS;
}

export const unsubscribe = () => {
  fyersWS.unsubscribe();
};

export default getFyersWebSocket;
