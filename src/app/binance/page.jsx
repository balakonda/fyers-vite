import {
  Box,
  Typography,
  Button,
  ButtonGroup,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableContainer,
  Paper,
  InputLabel,
  Select,
  MenuItem,
  TextField,
} from '@mui/material'
import { useState, useEffect, useMemo } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { formatNumber, formatNumberInUSD } from '../../utils/numbers'

const usdttoinr = 85

const candlestickColumns = [
  {
    field: 'symbol',
    headerName: 'Symbol',
    renderCell: params => (
      <a href={`https://www.binance.com/en/futures/${params.row.symbol}`} target="_blank">
        {params.row.symbol}
      </a>
    ),
  },
  {
    field: 'close',
    width: 200,
    headerName: 'Close Price',
    valueGetter: value => {
      return `${formatNumberInUSD(value)} - ${formatNumber(Math.round(value * usdttoinr))}`
    },
  },
  {
    field: 'volume',
    headerName: 'Volume',
    valueGetter: value => {
      return parseFloat(value).toFixed(2)
    },
  },
  {
    field: 'amount',
    headerName: 'USDT Amount',
    width: 170,
    valueGetter: value => {
      return formatNumberInUSD(Math.round(value))
    },
  },
  {
    field: 'price',
    headerName: 'INR Price',
    width: 200,
    valueGetter: (value, row) => {
      return formatNumber(Math.round(row.amount * usdttoinr))
    },
  },
  {
    field: 'startTime',
    width: 170,
    headerName: 'Start Time',
    valueGetter: (value, row) => {
      return new Date(value).toLocaleString()
    },
  },
]

const onecr = 10000000
const optionsFor20Crores = () => {
  const options = []
  for (let i = 1; i <= 20; i++) {
    options.push({ value: i * onecr, label: `${i} Cr` })
  }
  return options
}

export default function Binance() {
  const [connectionStatus, setConnectionStatus] = useState(false)
  const [history, setHistory] = useState([])
  const [volumeFileHistory, setVolumeFileHistory] = useState([])
  const [volDays, setVolDays] = useState(10)
  const [volSwitchValue, setVolSwitchValue] = useState(10)
  const [exchangeInfo, setExchangeInfo] = useState([])
  const [testConnection, setTestConnection] = useState(false)
  const [accountInfo, setAccountInfo] = useState([])
  const [showAccountInfo, setShowAccountInfo] = useState(false)
  const [candlesticks, setCandlesticks] = useState([])
  const [symbolFilter, setSymbolFilter] = useState('')
  const [amountFilter, setAmountFilter] = useState(100000000)

  const disconnect = () => {
    setConnectionStatus(false)
  }

  const getHistory = () => {
    setHistory(true)
  }

  const getExchangeInfo = async () => {
    const response = await fetch('http://localhost:5000/api/get-binance-exchange-info')
    const result = await response.json()
    console.log(result)
    if (result.status === 200) {
      setExchangeInfo(result.response)
    } else {
      setExchangeInfo(false)
    }
  }

  const handleTestConnection = async () => {
    const response = await fetch('http://localhost:5000/api/test-binance')
    const result = await response.json()
    console.log(result)
    setTestConnection(result && result.response)
  }

  const connect = async () => {
    const response = await fetch('http://localhost:5000/api/start-binance')
    const result = await response.json()
    console.log(result)
    setConnectionStatus(true)
    handleTestConnection()
  }

  const startTracking = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/listen-binance-candles')
      const result = await response.json()
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const getAccountInfo = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/get-binance-account-info')
      const result = await response.json()
      console.log(result)
      setAccountInfo(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleShowAccountInfo = () => {
    setShowAccountInfo(!showAccountInfo)
    console.log(accountInfo)
  }

  // /get-binance-candlesticks
  const getCandlesticks = async () => {
    const response = await fetch('http://localhost:5000/api/get-binance-candlesticks')
    const result = await response.json()
    if (result.status === 200) {
      setCandlesticks(result.response)
    } else {
      setCandlesticks([])
    }
  }

  const getCandlesticksByAmount = async () => {
    const response = await fetch(`http://localhost:5000/api/get-binance-candlesticks-by-amount?amount=${amountFilter}`)
    const result = await response.json()
    if (result.status === 200) {
      setCandlesticks(result.response)
    } else {
      setCandlesticks([])
    }
  }

  useEffect(() => {
    // Check test connection every 30secs
    const interval = setInterval(() => {
      handleTestConnection()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     getCandlesticks()
  //   }, 30000)
  //   return () => clearInterval(interval)
  // }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      getCandlesticksByAmount()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getCandlesticksBySymbol = useMemo(() => {
    return symbolFilter ? candlesticks.filter(candlestick => candlestick.symbol.includes(symbolFilter)) : candlesticks
  }, [symbolFilter, candlesticks])

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Binance</Typography>
      <Divider />
      <Accordion>
        <AccordionSummary>
          <Typography>
            Actions:{' '}
            {testConnection ? <span style={{ color: 'green' }}>Connected</span> : <span style={{ color: 'red' }}>Disconnected</span>}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ButtonGroup variant="outlined" aria-label="Basic button group">
              <Button onClick={connect}>Connect</Button>
              <Button onClick={disconnect}>Disconnect</Button>
              <Button onClick={getExchangeInfo}>Get Exchange Info</Button>
              <Button onClick={handleTestConnection}>Test</Button>
              <Button onClick={startTracking}>Start Tracking</Button>
              <Button onClick={getAccountInfo}>Account Info</Button>
              <Button onClick={handleShowAccountInfo}>{showAccountInfo ? 'Hide Account Info' : 'Show Account Info'}</Button>
              <Button onClick={getCandlesticksByAmount}>Get Candlesticks</Button>
            </ButtonGroup>
          </Box>
        </AccordionDetails>
      </Accordion>
      {showAccountInfo && (
        <Box>
          <Typography>Account Info</Typography>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(accountInfo, null, 2)}</Typography>
        </Box>
      )}
      {candlesticks.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography>Last 5 minutes of candlesticks</Typography>
            <Select
              size="small"
              id="outlined-basic"
              label="Filter by Amount"
              variant="outlined"
              value={amountFilter}
              onChange={e => {
                setAmountFilter(e.target.value)
              }}
            >
              {optionsFor20Crores().map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            <TextField
              size="small"
              id="outlined-basic"
              label="Filter by symbol"
              variant="outlined"
              onChange={e => {
                setSymbolFilter(e.target.value)
              }}
            />
          </Box>
          <DataGrid
            className="candlestick-table"
            getRowId={row => row.symbol + row.startTime}
            columns={candlestickColumns}
            pageSizeOptions={[5, 10]}
            rows={getCandlesticksBySymbol}
            aria-label="simple table"
            disableColumnFilter
            disableColumnSelector
            disableDensitySelector
            showToolbar
          ></DataGrid>
        </Box>
      )}
      {/* <Accordion>
              <AccordionSummary>
                  <Typography>Exchange Info</Typography>
              </AccordionSummary>
              <AccordionDetails>
                  <Typography sx={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(exchangeInfo, null, 2 )}</Typography>
              </AccordionDetails>
          </Accordion> */}
    </Box>
  )
}
