import React, { useState, useMemo } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Box,
  Pagination,
  Typography,
} from '@mui/material'
import Stack from '@mui/material/Stack'
export default function AvgVolumeHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  // Extract symbols (keys of the avgVolumeHistory object)
  let avgVolumeHistory = localStorage.getItem('volumeFileHistory')
  if (avgVolumeHistory) {
    avgVolumeHistory = JSON.parse(avgVolumeHistory)
  }

  // Filter symbols based on search term and paginate
  const filteredSymbols = useMemo(() => {
    const symbols = Object.keys(avgVolumeHistory || {})
    return symbols.filter(symbol => symbol.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [avgVolumeHistory, searchTerm])

  const paginatedSymbols = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage
    return filteredSymbols.slice(startIndex, startIndex + rowsPerPage)
  }, [filteredSymbols, page])

  const handleSearchChange = event => {
    setSearchTerm(event.target.value)
    setPage(1) // Reset to first page when searching
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const pageCount = Math.ceil(filteredSymbols.length / rowsPerPage)

  return (
    <Stack sx={{ p: 2 }} direction="column" spacing={2}>
      <Box sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
        <TextField
          label="Search by Symbol"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mr: 2, width: 200 }}
        />
        <Typography variant="body2" sx={{ ml: 'auto' }}>
          {filteredSymbols.length} symbols found
        </Typography>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="average volume history table">
          <TableHead>
            <TableRow>
              <TableCell>Symbol</TableCell>
              {[...Array(10)].map((_, index) => (
                <TableCell key={index} align="right">
                  Day {index + 1}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedSymbols.map(symbol => (
              <TableRow key={symbol}>
                <TableCell component="th" scope="row">
                  {symbol}
                </TableCell>
                {[...Array(10)].map((_, index) => (
                  <TableCell key={index} align="right">
                    {avgVolumeHistory[symbol]?.volByDays[index + 1]?.avgVolume || '-'}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination count={pageCount} page={page} onChange={handlePageChange} color="primary" />
        </Box>
      )}
    </Stack>
  )
}
