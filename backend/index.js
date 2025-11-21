// backend/index.js
require("dotenv").config();
const app = require("./app");
const config = require("./utils/config");

app.listen(config.PORT, () => {
  console.log(`server is running on port ${config.PORT}`);
});
