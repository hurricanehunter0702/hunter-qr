const express = require("express");
const app = express();
app.enable("trust proxy");

app.use((req, res, next) => {
  if (req.secure) {
    next();
  } else {
    res.redirect(`https://${req.headers.host}${req.url}`);
  }
});

module.exports = (app, httpPort) => {
    app.listen(httpPort);
}

