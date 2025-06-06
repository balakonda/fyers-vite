'use client'
import React, { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import Stack from '@mui/material/Stack'
import Input from '@mui/material/Input'
import Checkbox from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'

export const formatNumber = value => {
  if (!value) {
    return ''
  }
  return value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
  })
}

const Filters = ({ handleBlurAmountChange, isAmountChecked, handleAmountChecked }) => {
  const [amountValue, setAmountValue] = useState(20000000)

  const handleAmountChange = event => {
    setAmountValue(Number(event.target.value))
  }

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Input
        placeholder="Amount"
        type="number"
        value={amountValue}
        onChange={handleAmountChange}
        onBlur={() => handleBlurAmountChange(amountValue)}
      />
      {amountValue && <span>{formatNumber(amountValue)}</span>}
      <Stack direction="row" spacing={2} alignItems="center">
        <Checkbox checked={isAmountChecked} onChange={handleAmountChecked} label="Enable Filter" />
        <span>Enable Filter</span>
      </Stack>
    </Stack>
  )
}
const MarketDataTable = ({ data, isVolume = false }) => {
  const [blurAmountValue, setBlurAmountValue] = useState(20000000)
  const [isAmountChecked, setIsAmountChecked] = useState(false)

  const handleBlurAmountChange = amountValue => {
    setBlurAmountValue(amountValue)
  }

  const handleAmountChecked = event => {
    setIsAmountChecked(event.target.checked)
  }

  const filteredData = useMemo(() => {
    return data.filter(row => {
      if (isAmountChecked) {
        return row.amount > blurAmountValue
      }
      return true
    })
  }, [data, isAmountChecked, blurAmountValue])

  return (
    <Stack direction="column" spacing={2} alignItems="center">
      {!isVolume && (
        <Filters
          handleBlurAmountChange={handleBlurAmountChange}
          isAmountChecked={isAmountChecked}
          handleAmountChecked={handleAmountChecked}
        />
      )}
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table size="small" aria-label="market data table" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              <TableCell align="right">LTP</TableCell>
              {/* <TableCell align="right">Bid Price</TableCell>
            <TableCell align="right">Ask Price</TableCell> */}
              {/* {isVolume && <TableCell align="right">Avg Volume</TableCell>} */}
              {isVolume && <TableCell align="right">Relative Volume</TableCell>}
              {!isVolume && <TableCell align="right">Volume Change</TableCell>}
              <TableCell align="right">Amount</TableCell>
              {/* <TableCell align="right">High</TableCell>
            <TableCell align="right">Low</TableCell> */}
              {/* <TableCell align="right">Change %</TableCell> */}
              <TableCell align="right">Last Traded Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map(row => (
              <TableRow key={row.key} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  <a href={`https://trade.fyers.in/popout/index.html?symbol=${row.symbol}`} target="_blank">
                    {row.symbol}
                  </a>
                </TableCell>
                <TableCell align="right">{row.ltp}</TableCell>
                {/* <TableCell align="right">{row.bid_price}</TableCell>
              <TableCell align="right">{row.ask_price}</TableCell> */}
                {/* {isVolume && <TableCell align="right">{row.avg_volume}</TableCell>} */}
                {isVolume && (
                  <TableCell align="right">
                    <Tooltip title={`Vol Change: ${row.vol_change} / Avg Volume: ${row.avg_volume}`}>
                      <span>{Math.round(row.vol_change / row.avg_volume)}</span>
                    </Tooltip>
                  </TableCell>
                )}
                {!isVolume && <TableCell align="right">{row.vol_change}</TableCell>}
                <TableCell align="right" style={{ fontWeight: 'bold', color: row.amount > blurAmountValue ? 'lightgreen' : 'red' }}>
                  {row.formatted_amount}
                </TableCell>
                {/* <TableCell align="right">{row.high_price}</TableCell>
              <TableCell align="right">{row.low_price}</TableCell> */}
                {/* <TableCell align="right">{row.change_percentage}%</TableCell> */}
                <TableCell align="right">{row.last_traded_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  )
}

export default MarketDataTable
