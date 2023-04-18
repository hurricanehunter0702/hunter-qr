const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
require("dotenv").config();

(async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DB connected");
  } catch (err) {
    console.log("DB connection failed", err);
  }
})();

module.exports = mongoose.connection;
