SPOT_VARIABLES = {
  development: {
    btcTradedAmount: "0.001",
    pair: "BTCUSDT",
    priceBuyIn: 22975,
    priceSellIn: 22975 * 1.0000001
  },
  production: {
    btcTradedAmount: "0.00017",
    pair: "BRLBTC",
    priceBuyIn: 120000,
    priceSellIn: 120000 * 1.02
  }
}

FUTURE_VARIABLES = {
  development: {
    btcTradedAmount: "0.001",
    pair: "BTCUSDT",
    priceSellIn: 22975,
    priceBuyIn: 22975 * 0.98
  },
  production: {
    btcTradedAmount: "0.00017",
    pair: "BRLBTC",
    priceSellIn: 120000,
    priceBuyIn: 120000 * 0.98
  }
}

module.exports = {SPOT_VARIABLES, FUTURE_VARIABLES};