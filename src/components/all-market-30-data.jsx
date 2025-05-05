'use client'
import React, { useState, useEffect } from 'react'
import MarketDataTable from './MarketDataTable'
import { formatNumber } from '../utils/numbers'
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

export const formatMarketData = (marketData, switchValue) => {
  // check if marketData.message is an object
  if (!marketData) {
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
        return {
          key: currentData.symbol,
          symbol: currentData.symbol,
          ltp: currentData.ltp,
          vol_change: volChange,
          amount: amount,
          formatted_amount: formatNumber(amount),
          last_traded_time: currentData.last_traded_time ? new Date(currentData.last_traded_time * 1000).toLocaleTimeString() : '',
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
  return spreadData.filter(item => !!item).sort((a, b) => b.last_traded_time - a.last_traded_time) || []
}

const Market30Data = ({ switchValue }) => {
  const [marketData, setMarketData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (isLoading) {
    return <div>Loading market data...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  // Get Keys from marketData.message
  const formatData = () => {
    const formattedData = formatMarketData(marketData, switchValue)
    return formattedData
  }

  return (
    <Card variant="outlined">
      <CardHeader title="Price based Live Market Data" />
      <CardContent>
        <MarketDataTable data={formatData()} />
      </CardContent>
    </Card>
  )
}

export default Market30Data
