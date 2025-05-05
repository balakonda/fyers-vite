'use client'
import React, { useState, useEffect } from 'react'
import MarketDataTable from './MarketDataTable'
import { formatNumber } from '../utils/numbers'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'

const isJSON = data => {
  try {
    JSON.parse(data)
    return true
  } catch (error) {
    return false
  }
}
// get current day DD
const currentDay = new Date().getDate()
console.log('currentDay', currentDay)

const getVolumeKey = symbol => {
  return `history:${currentDay}:${symbol}`
}

const getVolumeData = (volData, symbol) => {
  return volData[getVolumeKey(symbol)]
}

const checkVolChange = (volData, item, volSwitchValue = 1) => {
  const volChange = getVolumeData(volData, item.symbol)
  // console.log('volChange', volChange);
  if (volChange && volChange.avgVolume && volChange.avgVolume > 0 && volChange.avgVolume * volSwitchValue < item.vol_change) {
    return volChange
  } else {
    // console.log("No vol change for", item.symbol);
    return false
  }
}

export const formatVolMarketData = (marketData, volData, switchValue, volSwitchValue) => {
  console.log('volData', volData, volSwitchValue, switchValue)
  // check if marketData.message is an object
  if (!marketData || !volData) {
    return []
  }

  // console.log("formatMarketData", marketData);
  const keys = Object.keys(marketData)
  const formattedData = keys.map(key => {
    const data = marketData[key]
    // if (data && Array.isArray(data)) {
    //   return data.map((item) => JSON.parse(item));
    // }
    if (data) {
      // data = {current30Data: {}, current60Data: {}, previous30Data: {}, previous60Data: {}}
      // current30Data = {"symbol": "NSE:ABB-EQ","ltp": 5645,"type": "sf","vol_traded_today": 109794,"last_traded_time": 1745297130,"last_traded_qty": 1,"tot_buy_qty": 33551,"tot_sell_qty": 36819}
      let currentData
      let previousData
      if (switchValue === 30) {
        if (data.current30Data && data.current60Data) {
          currentData = data.current60Data
          previousData = data.current30Data
        }
      } else if (switchValue === 60) {
        if (data.current60Data && data.previous60Data) {
          currentData = data.current60Data
          previousData = data.previous60Data
        }
      }
      if (currentData && previousData) {
        const volChange = currentData.vol_traded_today - previousData.vol_traded_today
        const amount = Math.round(volChange * currentData.ltp)
        const volChangeData = getVolumeData(volData, currentData.symbol)
        return {
          key: currentData.symbol,
          symbol: currentData.symbol,
          ltp: currentData.ltp,
          vol_change: volChange,
          avg_volume: volChangeData?.avgVolume,
          amount: amount,
          formatted_amount: formatNumber(amount),
          last_traded_time: currentData.last_traded_time ? new Date(currentData.last_traded_time * 1000).toLocaleString() : '',
        }
      }
    }

    return {
      symbol: key,
    }
  })
  // Check if formattedData item is an array then spread it
  const spreadData = []
  formattedData.forEach(item => {
    if (Array.isArray(item)) {
      spreadData.push(...item)
    } else {
      spreadData.push(item)
    }
  })
  return (
    spreadData
      .filter(item => !!item && checkVolChange(volData, item, volSwitchValue))
      .sort((a, b) => b.last_traded_time - a.last_traded_time) || []
  )
}

const MarketVolData = ({ switchValue, volSwitchValue }) => {
  const [marketData, setMarketData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [volData, setVolData] = useState(null)

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-all-market-30-data')
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        const data = await response.json()
        setMarketData(data?.data)
        setIsLoading(false)
      } catch (err) {
        setError(err.message)
        setIsLoading(false)
      }
    }

    // Initial fetch
    fetchMarketData()

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => {
      fetchMarketData()
    }, 10000)

    // Clean up interval on component unmount
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    const allHistory = localStorage.getItem('allHistory')
    const allHistoryData = JSON.parse(allHistory)
    console.log('allHistoryData', allHistoryData)
    setVolData(allHistoryData)
  }, [])

  if (!volData) {
    return <div>History not found...</div>
  }

  if (isLoading) {
    return <div>Loading market data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Get Keys from marketData.message
  const formatData = () => {
    const formattedData = formatVolMarketData(marketData, volData, switchValue, volSwitchValue)
    return formattedData
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Vol based Live Market Data" />
      <CardContent>
        <Box className="market-data-container">
          <MarketDataTable data={formatData()} isVolume={true} />
        </Box>
      </CardContent>
    </Card>
  )
}

export default MarketVolData
