"use client";
import React, { useState, useEffect, useMemo } from "react";
import MarketDataTable from "./MarketDataTable";
import { formatMarketData } from "./all-market-data";

const SelectedMarket30Data = ({ selectedSymbols }) => {
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      if (selectedSymbols.length === 0) {
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/get-market-30-data?symbol=" + selectedSymbols.join(","));
        console.log(response);
        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }
        const data = await response.json();
        console.log(data);
        setMarketData(data?.data);
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchMarketData();

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchMarketData();
    }, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [selectedSymbols]);

  const formatData = useMemo(() => {
    const formattedData = formatMarketData(marketData);
    return formattedData;
  }, [marketData]);

  if (isLoading) {
    return <div>Loading market data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get Keys from marketData.message

  return (
    <div className="market-data-container">
      <h2>Selected Stocks Market Data</h2>
      <MarketDataTable data={formatData} />
    </div>
  );
};

export default SelectedMarket30Data;
