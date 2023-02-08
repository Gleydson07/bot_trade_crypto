const axios = require("axios");
const crypto = require("crypto");
const {SPOT_VARIABLES} = require('./TradeVariables');

class Spot {
  constructor(){
    this.isOpened = false;
  };

  async spotMarket(event, environment) {
    const obj = JSON.parse (event.data);
    const printMarket = {
      Symbol: obj.s,
      Price: parseFloat(obj.a),
      Order: this.isOpened ?
        `Comprar em: ${SPOT_VARIABLES[environment].priceBuyIn}` :
        `Vender em: ${SPOT_VARIABLES[environment].priceSellIn}`
    }
  
    console.log(printMarket);

    if (printMarket.Price <= SPOT_VARIABLES[environment].priceBuyIn && !this.isOpened) {
      this.newOrder(
        SPOT_VARIABLES[environment].pair, 
        SPOT_VARIABLES[environment].btcTradedAmount, 
        "BUY"
      );

      console.log("SPOT - Comprou...");
      this.isOpened = true;
    }

    if (printMarket.Price >= SPOT_VARIABLES[environment].priceSellIn && this.isOpened) {
      this.newOrder(
        SPOT_VARIABLES[environment].pair, 
        SPOT_VARIABLES[environment].btcTradedAmount, 
        "SELL"
      );

      console.log("SPOT - Vendeu...");
      this.isOpened = false;
    }
  }
  
  async newOrder(symbol, quantity, side) {
    const data = {
      symbol,
      quantity,
      side,
      type: 'MARKET',
      timestamp: Date.now()
    };
  
    const signature = crypto
      .createHmac('sha256', process.env.SECRET_KEY_SPOT)
      .update(new URLSearchParams(data).toString())
      .digest("hex");
  
    data.signature = signature;
  
    try {
      const result = await axios({
        method: "POST",
        url: process.env.API_URL_SPOT + "/v3/order?" + new URLSearchParams(data),
        headers: {"X-MBX-APIKEY": process.env.API_KEY_SPOT}
      });
  
      console.log({order: result.data});
    } catch (error) {
      console.log({ error });
    }
  }
}


module.exports = new Spot;