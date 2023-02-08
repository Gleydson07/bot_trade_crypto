const axios = require("axios");
const crypto = require("crypto");
const {FUTURE_VARIABLES} = require('./TradeVariables');

class Future {
  constructor(){
    this.isOpened = false;
  };

  async market(event, environment) {
    const obj = JSON.parse (event.data);
    const printMarket = {
      Symbol: obj.s,
      Price: parseFloat(obj.a),
      Order: this.isOpened ?
        `Comprar em: ${FUTURE_VARIABLES[environment].priceBuyIn}` :
        `Vender em: ${FUTURE_VARIABLES[environment].priceSellIn}`
    }
  
    console.log(printMarket);

    if (printMarket.Price <= FUTURE_VARIABLES[environment].priceBuyIn && !this.isOpened) {
      this.newOrder(
        FUTURE_VARIABLES[environment].pair, 
        FUTURE_VARIABLES[environment].btcTradedAmount, 
        "BUY"
      );

      console.log("FUTURE - Comprou...");
      this.isOpened = true;
    }

    if (printMarket.Price >= FUTURE_VARIABLES[environment].priceSellIn && this.isOpened) {
      this.newOrder(
        FUTURE_VARIABLES[environment].pair, 
        FUTURE_VARIABLES[environment].btcTradedAmount, 
        "SELL"
      );

      console.log("FUTURE - Vendeu...");
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
      .createHmac('sha256', process.env.SECRET_KEY_FUTURE)
      .update(new URLSearchParams(data).toString())
      .digest("hex");
  
    data.signature = signature;
  
    try {
      const result = await axios({
        method: "POST",
        url: process.env.API_URL_FUTURE + "/v3/order?" + new URLSearchParams(data),
        headers: {"X-MBX-APIKEY": process.env.API_KEY_FUTURE}
      });
  
      console.log({order: result.data});
    } catch (error) {
      console.log({ error });
    }
  }
}


module.exports = new Future;