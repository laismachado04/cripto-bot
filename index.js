//BTC-USDT

//Chat ID 958168746

const CHAT_ID = 958168746;
let lastmessage = "";
const PAR = "BTC-USDT"

function calcRSI(closes) {
    let altas = 0;
    let baixas = 0;

    for (let i=closes.length - 14; i < closes.length - 1; i++) {
        const diferenca = closes[i] - closes[i-1]
        if (diferenca >= 0)
            altas += diferenca;
        else
            baixas += diferenca;
    }

    const forcaRelativa = altas / baixas;
    return 100 - (100 / (1 + forcaRelativa));
}

function botMessage(price, rsi, lastmessage) {
    const { Telegraf } = require('telegraf');
    const bot = new Telegraf('secret_key');
    bot.telegram.sendMessage(CHAT_ID, '💹' + PAR + '\n\nPreço: '  + price + " \nRSI: " + rsi + "\n" + lastmessage);
}

async function process() {
    const axios = require("axios");

    const response = await axios.get("https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m");
    const candle = response.data[499];
    const price = parseFloat(candle[4]);

    const closes = response.data.map(candle => parseFloat(candle[4]));
    const rsi = calcRSI(closes);

    if (rsi >= 70 && lastmessage !== "Sobrecomprado!") {
        lastmessage = "Sobrecomprado!"
        console.log("Preço: " + price + "\nRSI: " + rsi + " - " + lastmessage);
        botMessage(price, rsi, lastmessage)

    }
    else if (rsi <= 30 && lastmessage !== "Sobrevendido!") {
        lastmessage = "Sobrevendido!"
        console.log("Preço: " + price + "\nRSI: " + rsi + " - " + lastmessage);
        botMessage(price, rsi, lastmessage)
    }
}

setInterval(process, 1000)

process();
