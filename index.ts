import { Client, Guild, Intents } from "discord.js";
require("dotenv").config();

const MIN_REFRESH = process.env.MIN_TIME_REFRESH || 10000;
const MAX_REFRESH = process.env.MAX_TIME_REFRESH || 15000;
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID;

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

function randomIntFromInterval(min: string | number, max: string | number) {
  return Math.floor(
    Math.random() * (Number(max) - Number(min) + 1) + Number(min)
  );
}

const mapCoinsToChannelId: {
  [key: string]: { channelId: string; lastPrice: string };
} = {
  USDTBRL: {
    channelId: "886369502919557170",
    lastPrice: "",
  },
  SLPUSDT: {
    channelId: "886331101226872883",
    lastPrice: "",
  },
  ETHUSDT: {
    channelId: "886330810649673728",
    lastPrice: "",
  },
  SOLUSDT: {
    channelId: "886275084845711371",
    lastPrice: "",
  },
  BTCUSDT: {
    channelId: "886330851946795048",
    lastPrice: "",
  },
  MINAUSDT: {
    channelId: "886390689150152745",
    lastPrice: "",
  },
};

const BINANCE_API_URL = "https://api.binance.com/api/v3/avgPrice?symbol=";

async function fetchCoinPrices() {
  for (const coin in mapCoinsToChannelId) {
    const response = await fetch(`${BINANCE_API_URL}${coin}`);
    const json = await response.json();
    const price = json.price;

    mapCoinsToChannelId[coin].lastPrice = price;
  }
}

client.login(process.env.DISCORD_APPLICATION_TOKEN);

client.on("ready", () => {
  let guild: Guild = client.guilds.cache.get(DISCORD_GUILD_ID as string)!;

  async function fetchCoinPrices() {
    for (const coin in mapCoinsToChannelId) {
      const response = await fetch(`${BINANCE_API_URL}${coin}`);
      const json = await response.json();
      const price = json.price;

      mapCoinsToChannelId[coin].lastPrice = price;
      let channel = guild.channels.cache.get(
        mapCoinsToChannelId[coin].channelId
      );
      channel?.setName(price);
    }
  }

  setTimeout(fetchCoinPrices, randomIntFromInterval(MIN_REFRESH, MAX_REFRESH));
});
