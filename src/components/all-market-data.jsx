
import React, { useState, useEffect } from "react";
import MarketDataTable from "./MarketDataTable";

const isJSON = (data) => {
  try {
    JSON.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const formatMarketData = (marketData) => {
  // check if marketData.message is an object
  if (!marketData) {
    return [];
  }
  console.log("formatMarketData", marketData);
  const keys = Object.keys(marketData);
  const formattedData = keys.map((key) => {
    const data = marketData[key];
    if (data && Array.isArray(data)) {
      return data.map((item) => JSON.parse(item));
    }
    if (data && isJSON(data)) {
      return {
        key,
        ...JSON.parse(data),
      };
    }
    return null;
  });
  // Check if formattedData item is an array then spread it
  const spreadData = [];
  formattedData.forEach((item) => {
    if (Array.isArray(item)) {
      spreadData.push(...item);
    } else {
      spreadData.push(item);
    }
  });
  return spreadData.filter((item) => !!item).sort((a, b) => b.last_traded_time - a.last_traded_time) || [];
};

const AllMarketData = () => {
  const [marketData, setMarketData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch("http://localhost:5000/get-all-market-data");
        if (!response.ok) {
          throw new Error("Failed to fetch market data");
        }
        const data = await response.json();
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
  }, []);

  if (isLoading) {
    return <div>Loading market data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  // Get Keys from marketData.message
  const formatData = () => {
    const formattedData = formatMarketData(marketData);
    return formattedData;
  };

  return (
    <div className="market-data-container">
      <h2>Market Data</h2>
      <MarketDataTable data={formatData()} />
    </div>
  );
};

export default AllMarketData;
