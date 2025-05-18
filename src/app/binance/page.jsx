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
  TextField,
} from '@mui/material'
import { useState, useEffect } from 'react'
import { DataGrid } from '@mui/x-data-grid'

const candlestickColumns = [
  { field: 'symbol', headerName: 'Symbol' },
  {
    field: 'open',
    headerName: 'Open',
    valueGetter: value => {
      return Math.round(value)
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
    field: 'eventTime',
    width: 170,
    headerName: 'Event Time',
    valueGetter: (value, row) => {
      return new Date(value).toLocaleString()
    },
  },
  {
    field: 'close',
    headerName: 'Close',
    valueGetter: value => {
      return Math.round(value)
    },
  },
  {
    field: 'buyVolume',
    headerName: 'Buy Volume',
    valueGetter: value => {
      return parseFloat(value).toFixed(2)
    },
  },
]

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

  useEffect(() => {
    // Check test connection every 30secs
    const interval = setInterval(() => {
      handleTestConnection()
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const getCandlesticksBySymbol = () => {
    return symbolFilter ? candlesticks.filter(candlestick => candlestick.symbol.includes(symbolFilter)) : candlesticks
  }

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
              <Button onClick={getCandlesticks}>Get Candlesticks</Button>
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
            getRowId={row => row.symbol + row.eventTime}
            columns={candlestickColumns}
            pageSizeOptions={[5, 10]}
            rows={getCandlesticksBySymbol()}
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
