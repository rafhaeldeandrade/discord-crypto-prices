require("dotenv").config();

const MIN_REFRESH = process.env.MIN_TIME_REFRESH || 10000;
const MAX_REFRESH = process.env.MAX_TIME_REFRESH || 15000;
