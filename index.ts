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
  [key: string]: { channelId: string; channelSlug: string };
} = {
  USDTBRL: {
    channelId: "886369502919557170",
    channelSlug: "USDT/BRL: ",
  },
  SLPUSDT: {
    channelId: "886331101226872883",
    channelSlug: "SLP/USDT: ",
  },
  ETHUSDT: {
    channelId: "886330810649673728",
    channelSlug: "ETH/USDT: ",
  },
  SOLUSDT: {
    channelId: "886275084845711371",
    channelSlug: "SOL/USDT: ",
  },
  BTCUSDT: {
    channelId: "886330851946795048",
    channelSlug: "BTC/USDT: ",
  },
  MINAUSDT: {
    channelId: "886390689150152745",
    channelSlug: "MINA/USDT: ",
  },
};

client.login(process.env.DISCORD_APPLICATION_TOKEN);

client.on("ready", () => {
  const BINANCE_API_URL =
    "https://api.binance.com/api/v3/ticker/price?symbols=";
  const symbolsArray = JSON.stringify(Object.keys(mapCoinsToChannelId));
  let guild: Guild = client.guilds.cache.get(DISCORD_GUILD_ID as string)!;

  async function fetchCoinPrices() {
    const response = await axios.get(`${BINANCE_API_URL}${symbolsArray}`);

    response.data.forEach(
      ({ symbol, price }: { symbol: string; price: string }) => {
        let channel = guild.channels.cache.get(
          mapCoinsToChannelId[symbol].channelId
        );

        const channelSlug = mapCoinsToChannelId[symbol].channelSlug;
        const channelPrice = Number(price).toFixed(3);

        channel?.setName(`${channelSlug}${channelPrice}`);
      }
    );
  }

  setTimeout(async () => {
    await fetchCoinPrices();
  }, randomIntFromInterval(MIN_REFRESH, MAX_REFRESH));
});
