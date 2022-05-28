"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
require("dotenv").config();
const MIN_REFRESH = process.env.MIN_TIME_REFRESH || 10000;
const MAX_REFRESH = process.env.MAX_TIME_REFRESH || 15000;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;
const client = new discord_js_1.Client({ intents: [discord_js_1.Intents.FLAGS.GUILDS] });
function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (Number(max) - Number(min) + 1) + Number(min));
}
const mapCoinsToChannelId = {
    USDTBRL: {
        channelId: "886369502919557170",
        channelSlug: "USDT/BRL: ",
        lastPrice: "",
    },
    SLPUSDT: {
        channelId: "886331101226872883",
        channelSlug: "SLP/USDT: ",
        lastPrice: "",
    },
    ETHUSDT: {
        channelId: "886330810649673728",
        channelSlug: "ETH/USDT: ",
        lastPrice: "",
    },
    SOLUSDT: {
        channelId: "886275084845711371",
        channelSlug: "SOL/USDT: ",
        lastPrice: "",
    },
    BTCUSDT: {
        channelId: "886330851946795048",
        channelSlug: "BTC/USDT: ",
        lastPrice: "",
    },
    MINAUSDT: {
        channelId: "886390689150152745",
        channelSlug: "MINA/USDT: ",
        lastPrice: "",
    },
};
const BINANCE_API_URL = "https://api.binance.com/api/v3/avgPrice?symbol=";
client.login(process.env.DISCORD_APPLICATION_TOKEN);
client.on("ready", () => {
    let guild = client.guilds.cache.get(DISCORD_GUILD_ID);
    function fetchCoinPrices() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const coin in mapCoinsToChannelId) {
                const response = yield axios_1.default.get(`${BINANCE_API_URL}${coin}`);
                const { price } = response.data;
                mapCoinsToChannelId[coin].lastPrice = price;
                let channel = guild.channels.cache.get(mapCoinsToChannelId[coin].channelId);
                const channelSlug = mapCoinsToChannelId[coin].channelSlug;
                const channelPrice = Number(price).toFixed(3);
                channel === null || channel === void 0 ? void 0 : channel.setName(`${channelSlug}${channelPrice}`);
            }
        });
    }
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () { return yield fetchCoinPrices(); }), randomIntFromInterval(MIN_REFRESH, MAX_REFRESH));
});
