require("dotenv").config({
  path: process.env.NODE_ENV === "production" ? 
    ".env.production" :
    ".env.development"
});
const spot = require('./Spot');
const {SPOT_VARIABLES} = require('./TradeVariables');

const WebSocket = require("ws");

const wsSpot = new WebSocket(`${process.env.STREAM_URL_SPOT}${SPOT_VARIABLES[process.env.NODE_ENV].pair.toLowerCase()}@bookTicker`);

wsSpot.onmessage = async (event) => {
  spot.spotMarket(event, process.env.NODE_ENV);
}
