"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from "@mui/material";
import Stack from "@mui/material/Stack";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { amountList } from "./data";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TableSortLabel from "@mui/material/TableSortLabel";
import CardHeader from "@mui/material/CardHeader";
import Box from "@mui/material/Box";
import TablePagination from "@mui/material/TablePagination";

export const formatNumber = (value) => {
  if (!value) {
    return "";
  }
  return value.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
  });
};

const Filters = ({ handleAmountChange, blurAmountValue, fetchData }) => {
  const setAmountValue = (event) => {
    handleAmountChange(Number(event.target.value));
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Select value={blurAmountValue} onChange={setAmountValue} placeholder="Select Amount">
        {amountList.map((amount) => (
          <MenuItem key={amount} value={amount}>
            {formatNumber(amount)}
          </MenuItem>
        ))}
      </Select>
      <Button variant="contained" color="primary" onClick={fetchData}>
        Fetch Data
      </Button>
    </Stack>
  );
};

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
            <TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={{ visibility: "hidden" }}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const headCells = [
  { id: "symbol", numeric: false, disablePadding: true, label: "Symbol" },
  { id: "ltp", numeric: true, disablePadding: false, label: "LTP" },
  { id: "vol_change", numeric: true, disablePadding: false, label: "Volume Change" },
  { id: "amount", numeric: true, disablePadding: false, label: "Amount" },
  { id: "last_traded_time", numeric: false, disablePadding: false, label: "Last Traded Time" },
];

const TableData = ({ data }) => {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("symbol");
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(0);

  const handleRequestSort = (event, property) => {
    let newOrderBy = property;
    if (property === "last_traded_time") {
      newOrderBy = "last_traded_time_epoch";
    }
    const isAsc = orderBy === newOrderBy && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(newOrderBy);
    console.log(property, orderBy, isAsc);
  };

  const visibleRows = React.useMemo(() => [...data].sort(getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage), [order, orderBy, page, rowsPerPage, data]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (!data) return null;
  return (
    <Paper direction="column" spacing={2} alignItems="center">
      {/* <Filters handleBlurAmountChange={handleBlurAmountChange} isAmountChecked={isAmountChecked} handleAmountChecked={handleAmountChecked} /> */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="market data table" stickyHeader>
          <EnhancedTableHead order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={data.length} />
          <TableBody>
            {visibleRows.map((row) => (
              <TableRow key={row.key} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row.symbol}
                </TableCell>
                <TableCell align="right">{row.ltp}</TableCell>
                {/* <TableCell align="right">{row.bid_price}</TableCell>
              <TableCell align="right">{row.ask_price}</TableCell> */}
                <TableCell align="right">{row.vol_change}</TableCell>
                <TableCell align="right">{row.formatted_amount}</TableCell>
                {/* <TableCell align="right">{row.high_price}</TableCell>
              <TableCell align="right">{row.low_price}</TableCell> */}
                {/* <TableCell align="right">{row.change_percentage}%</TableCell> */}
                <TableCell align="right">{row.last_traded_time}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

const CalculatedData = () => {
  const [blurAmountValue, setBlurAmountValue] = useState(40000000);
  const [marketData, setMarketData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleAmountChange = (amountValue) => {
    setBlurAmountValue(amountValue);
  };

  const filteredData = useMemo(() => {
    let list = [];
    const symbols = Object.keys(marketData);

    for (const symbol of symbols) {
      const obj = marketData[symbol];
      // const redisKeys = Object.keys(obj);
      if (obj && obj.symbol) {
        list.push({
          key: symbol,
          symbol: obj.symbol,
          ltp: obj.ltp,
          vol_change: obj.volChange,
          amount: obj.amount,
          formatted_amount: formatNumber(obj.amount),
          last_traded_time: new Date(obj.last_traded_time * 1000).toLocaleString(),
          last_traded_time_epoch: obj.last_traded_time,
        });
      }
      // for (const key of redisKeys) {
      //   const data = obj[key];
      //   console.log(obj);

      // }
    }
    return list;
  }, [marketData]);

  //   const filteredData = useMemo(() => {
  //     return data.filter((row) => {
  //       if (isAmountChecked) {
  //         return row.amount > blurAmountValue;
  //       }
  //       return true;
  //     });
  //   }, [data, isAmountChecked, blurAmountValue]);

  const fetchData1 = async () => {
    if (!blurAmountValue) return;
    try {
      const response = await fetch(`http://localhost:5000/api/get-by-amount?amount=${blurAmountValue}`);
      const data = await response.json();
      setMarketData(data?.data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Call fetchData on mount and every 60 seconds
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!blurAmountValue) return;
        const response = await fetch(`http://localhost:5000/api/get-by-amount?amount=${blurAmountValue}`);
        console.log(response);
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
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 60000);
    return () => clearInterval(interval);
  }, [blurAmountValue]);

  return (
    <Card variant="outlined">
      <CardContent>
        <Stack direction="column" spacing={2} alignItems="center">
          <Filters blurAmountValue={blurAmountValue} handleAmountChange={handleAmountChange} fetchData={fetchData1} />
          <TableData data={filteredData} />
        </Stack>
      </CardContent>
    </Card>
  );
};

export default CalculatedData;
