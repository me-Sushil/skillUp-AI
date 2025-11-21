require("dotenv").config();

const PORT = process.env.PORT ? process.env.PORT : 3001;
const MONGODB_URL=process.env.MONGODB_URL;
const JWT_SECRET=process.env.JWT_SECRET;
const GEMINI_API_KEY=process.env.GEMINI_API_KEY;

module.exports = {PORT, MONGODB_URL, JWT_SECRET, GEMINI_API_KEY};