import { Client, Guild, Intents } from "discord.js";
import axios from "axios";

require("dotenv").config();

const MIN_REFRESH = process.env.MIN_TIME_REFRESH || 300000;
const MAX_REFRESH = process.env.MAX_TIME_REFRESH || 360000;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function randomIntFromInterval(min: string | number, max: string | number) {
  return Math.floor(
    Math.random() * (Number(max) - Number(min) + 1) + Number(min)
  );
}

const mapCoinsToChannelId: {
  [key: string]: { channelId: string; channelSlug: string; lastPrice: string };
} = {
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
  let guild: Guild = client.guilds.cache.get(DISCORD_GUILD_ID as string)!;

  async function fetchCoinPrices() {
    for (const coin in mapCoinsToChannelId) {
      const response = await axios.get(`${BINANCE_API_URL}${coin}`);
      const { price } = response.data;

      mapCoinsToChannelId[coin].lastPrice = price;

      let channel = guild.channels.cache.get(
        mapCoinsToChannelId[coin].channelId
      );
      const channelSlug = mapCoinsToChannelId[coin].channelSlug;
      const channelPrice = Number(price).toFixed(3);

      channel?.setName(`${channelSlug}${channelPrice}`);
    }
  }

  setTimeout(
    async () => await fetchCoinPrices(),
    randomIntFromInterval(MIN_REFRESH, MAX_REFRESH)
  );
});
