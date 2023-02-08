require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? 
    ".env.production" :
    ".env.development"
});
const spot = require('./Spot');
const future = require('./Future');
const {SPOT_VARIABLES} = require('./TradeVariables');

const WebSocket = require("ws");

const wsSpot = new WebSocket(`${process.env.STREAM_URL_SPOT}${SPOT_VARIABLES[process.env.NODE_ENV].pair.toLowerCase()}@bookTicker`);

const wsFuture = new WebSocket(`${process.env.STREAM_URL_FUTURE}${FUTURE_VARIABLES[process.env.NODE_ENV].pair.toLowerCase()}@markPrice@1s`);

wsSpot.onmessage = async (event) => {
  spot.market(event, process.env.NODE_ENV);
}

// wsFuture.onmessage = async (event) => {
//   future.market(event, process.env.NODE_ENV);
// }
