import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { NIFTY_200_LIST, amountList } from "../components/data";
import Market30Data from "../components/all-market-30-data";
import SelectedMarket30Data from "../components/selected-market-30-data";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";


import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { formatNumber } from "../utils/numbers";
import ButtonGroup from "@mui/material/ButtonGroup";
import CalculatedData from "../components/calculated-data";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import MarketVolData from "../components/all-market-vol-data";
import CalculatedVolData from "../components/calculated-vol-data";
import Input from "@mui/material/Input";

const STOCK_LIST = NIFTY_200_LIST.slice(0, 10).map((symbol) => `NSE:${symbol}-EQ`);

export default function Market() {
  const [showAllMarketData, setShowAllMarketData] = useState(false);
  const [showVolMarketData, setShowVolMarketData] = useState(false);
  const [showCalculatedData, setShowCalculatedData] = useState(false);
  const [showSelectedMarketData, setShowSelectedMarketData] = useState(false);
  const [showCalculatedVolData, setShowCalculatedVolData] = useState(false);
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [switchValue, setSwitchValue] = useState(30);
  const [volSwitchValue, setVolSwitchValue] = useState(1);
  const [amount, setAmount] = useState(30000000);
  const [value, setValue] = useState(0);

  const getAllMarketData = async () => {
    const response = await fetch("http://localhost:5000/api/get-all-market-30-data");
    // console.log(response);
    const result = await response.json();
    console.log(result);
  };
  const handleShowAllMarketData = () => {
    setShowAllMarketData(!showAllMarketData);
  };
  const handleChange = (event) => {
    setSelectedSymbols(event.target.value);
  };
  const handleSwitchChange = (event) => {
    setSwitchValue(Number(event.target.value));
  };
  const handleAmountChange = (event) => {
    setAmount(Number(event.target.value));
  };

  const handleShowCalculatedData = async () => {
    setShowCalculatedData(!showCalculatedData);
  };
  const handleCalculateAmount1 = async () => {
    const response = await fetch("http://localhost:5000/api/calculate-by-amount?amount=10000000");
    const result = await response.json();
    console.log(result);
  };
  const handleShowVolMarketData = () => {
    setShowVolMarketData(!showVolMarketData);
  };
  const handleVolSwitchChange = (event) => {
    setVolSwitchValue(Number(event.target.value));
  };
  const handleShowCalculatedVolData = () => {
    setShowCalculatedVolData(!showCalculatedVolData);
  };
  // Calculate amount for 10000000 every 60 seconds
  useEffect(() => {
    const handleCalculateAmount = async () => {
      const response = await fetch("http://localhost:5000/api/calculate-by-amount?amount=10000000");
      const result = await response.json();
      console.log(result);
    };
    handleCalculateAmount();
    const interval = setInterval(() => {
      handleCalculateAmount();
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box>
      
      
      <Accordion>
        <AccordionSummary>
          <Typography variant="p">Market Data</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Stack direction="row" spacing={2} alignItems="center">
            {/* <Stack direction="row" spacing={2} alignItems="center">
              <Button onClick={() => setShowSelectedMarketData(!showSelectedMarketData)}>Show Selected Market Data</Button>
              <Select size="sm" multiple labelId="demo-simple-select-label" id="demo-simple-select" value={selectedSymbols} label="Age" onChange={handleChange}>
                {STOCK_LIST.map((symbol) => (
                  <MenuItem key={symbol} value={symbol} size="sm">
                    {symbol}
                  </MenuItem>
                ))}
              </Select>
            </Stack> */}
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button onClick={handleShowVolMarketData}>{showVolMarketData ? "Hide Vol Market Data" : "Show Vol Market Data"}</Button>
              <Button onClick={handleShowAllMarketData}>{showAllMarketData ? "Hide All Market Data" : "Show All Market Data"}</Button>
            </ButtonGroup>
            <RadioGroup defaultValue="30" name="radio-buttons-group">
              <Stack direction="row" spacing={2} alignItems="center">
                <Stack direction="row" spacing={2} alignItems="center">
                  <Radio variant="outlined" size="sm" value="30" label="30" onChange={handleSwitchChange} />
                  <span style={{ fontWeight: switchValue === "30" ? "bold" : "normal" }}>30</span>
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Radio variant="outlined" size="sm" value="60" label="60" onChange={handleSwitchChange} />
                  <span style={{ fontWeight: switchValue === "60" ? "bold" : "normal" }}>60</span>
                </Stack>
                {/* <Input placeholder="Amount" type="number" value={amount} onChange={handleAmountChange} /> */}
              </Stack>
            </RadioGroup>
            <Input type="number" value={volSwitchValue} onChange={handleVolSwitchChange} />
            <Button variant="outlined" onClick={handleShowCalculatedData}>{showCalculatedData ? "Hide Calculated Data" : "Show Calculated Data"}</Button>
            <Button variant="outlined" onClick={handleShowCalculatedVolData}>{showCalculatedVolData ? "Hide Calculated Vol Data" : "Show Calculated Vol Data"}</Button>
            {/* <Card>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Select value={amount} onChange={handleAmountChange}>
                    {amountList.map((amount) => (
                      <MenuItem key={amount} value={amount}>
                        {formatNumber(amount)}
                      </MenuItem>
                    ))}
                  </Select>
                  <Button onClick={handleCalculateAmount1}>{"Calculate Amount"}</Button>
                  
                  <Typography variant="p">{formatNumber(amount)}</Typography>
                </Stack>
              </CardContent>
            </Card> */}
              </Stack>
        </AccordionDetails>
        </Accordion>
      <Stack direction="row" spacing={2}  flexWrap="wrap">
        {showVolMarketData && <MarketVolData switchValue={switchValue} volSwitchValue={volSwitchValue} />}
        {showAllMarketData && <Market30Data switchValue={switchValue} />}
        {/* {showSelectedMarketData && <SelectedMarket30Data selectedSymbols={selectedSymbols} />} */}
          {showCalculatedData && <CalculatedData />}
          {showCalculatedVolData && <CalculatedVolData volSwitchValue={volSwitchValue}/>}
      </Stack>
      {/* {showAllMarketData && <AllMarketData />} */}
      {/* {showSelectedMarketData && <SelectedMarketData selectedSymbols={selectedSymbols} />} */}
    </Box>
  );
}
