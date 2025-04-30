import fyers from "../components/getFyersAPI";

var inp = {
  symbol: "NSE:SBIN-EQ",
  resolution: "1",
  date_format: "0",
  range_from: "1690895316",
  range_to: "1691068173",
  cont_flag: "1",
};

const toUnixTime = (date) => {
  return Math.floor(date.getTime() / 1000);
};

export const getHistory = (symbol) => {
  // Get current time minus 3 minutes
  let from = toUnixTime(new Date());
  from -= 3 * 60 * 1000;
  // Get current time minus 1 minutes
  let to = toUnixTime(new Date());
  to -= 1 * 60 * 1000;
  inp.symbol = symbol;
  inp.range_from = from;
  inp.range_to = to;
  return fyers
    .getHistory(inp)
    .then((response) => {
      return response; // {
      //     "candles": [
      //         [
      //             1690861500, // Current timestamp
      //             620.2, // Open value
      //             620.85, // High value
      //             617.65, // Low value
      //             619.65, // Close value
      //             1846463 // Volume
      //         ],
      //     ],
      //     "code": 200,
      //     "message": "",
      //     "s": "ok"
      // }
    })
    .catch((err) => {
      return err;
    });
};

/** History  API docs
 * https://myapi.fyers.in/docsv3#tag/Data-Api/paths/~1DataApi/post
 * 
 * History API:
 * 
 * 
The historical API provides archived data (up to date) for the symbols. across various exchanges within the given range. A historical record is presented in the form of a candle and the data is available in different resolutions like - minute, 10 minutes, 60 minutes...240 minutes and daily.


To Handle partial Candle

To receive completed candle data, it is important to send a timestamp that comes before the current minute. If you send a timestamp for the current minute, you will receive partial data because the minute is not yet finished. Therefore, it is recommended to always use a "range_to" timestamp of the previous minute to ensure that you receive the completed candle data.

Example:
Current Time(seconds can be 1-59): 12:10:20 PM

Input for history will be:

range_from: 12:08:00 PM
range_to: Current Time - 1 minute = 12:09:20 PM
So you will get 2 candles - 12:08 PM and 12:09 PM candles. This example is for 1-minute candles; for other resolutions, you have to subtract the resolution time from "range_to" to get completed candles only.


Limits for History:
Unlimited number of stocks history data can be downloaded in a day.
Up to 100 days of data per request for resolutions of 1, 2, 3, 5, 10, 15, 20, 30, 45, 60, 120, 180, and 240 minutes. Data is available from July 3, 2017.
For 1D resolutions up to 366 days of data per request for 1D (1 day) resolutions.
For Seconds Charts the history will be available only for 30-Trading Days

Request Attribute:
Attribute	Data Type	Description
symbol*:	string	Mandatory. Eg: NSE:SBIN-EQ
resolution*:	string	The candle resolution. Possible values are: Day : “D” or “1D”
              5 seconds : “5S”
              10 seconds : “10S”
              15 seconds : “15S”
              30 seconds : “30S”
              45 seconds : “45S”
              1 minute : “1”
              2 minute : “2"
              3 minute : "3"
              5 minute : "5"
              10 minute : "10"
              15 minute : "15"
              20 minute : "20"
              30 minute : "30"
              60 minute : "60"
              120 minute : "120"
              240 minute : "240"
date_format*:	int	date_format is a boolean flag. 0 to enter the epoch value. Eg:670073472. 1 to enter the date format as yyyy-mm-dd.
range_from*:	string	Indicating the start date of records. Accepts epoch value if date_format flag is set to 0. Eg: range_from: 670073472
              Accepts yyyy-mm-dd format if date_format flag is set to 1. Eg: 2021-01-01
range_to*:	 string	Indicating the end date of records. Accepts epoch value if date_format flag is set to 0. Eg: range_to: 1622028732
             Accepts yyyy-mm-dd format if date_format flag is set to 1. Eg:2021-03-01
cont_flag*:	 int	set cont flag 1 for continues data and future options.
oi_flag*:   	int	set flag to "1" enable oi as a part of candle.


Response Attribute:
Attribute	Data Type	Description
s	string	ok / error
Candels	array	Candles data containing array of following data for particular time stamp:
1.Current epoch time
2. Open Value
3.Highest Value
4.Lowest Value
5.Close Value
6.Total traded quantity (volume)
 * 
 * 
 * 
 * 
   */

// I need to get total volume traded in a 30min gap, I will provide the symbol and start date and time. Calculate the end date and time by adding 30 minutes to the start date and time.
const getInput = (symbol, from) => {
  const to = new Date(from);
  to.setMinutes(to.getMinutes() + 30);
  return {
    symbol: symbol,
    resolution: "30",
    date_format: "0",
    range_from: from,
    range_to: to,
    cont_flag: "0",
  };
};

export const getTotalVolume = (candles) => {
  return candles.reduce((acc, candle) => acc + candle[5], 0);
};
