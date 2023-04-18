const https = require("https");
const http = require("http");
const fs = require("fs");
const sslKey = fs.readFileSync("ssl-key.pem");
const sslcert = fs.readFileSync("ssl-cert.pem");

const options = {
  key: sslKey,
  cert: sslcert,
};

module.exports = (app, httpPort, httpsPort) => {
  https.createServer(options, app).listen(httpsPort);
  http
    .createServer((req, res) => {
      res.writeHead(301, {
        Location: `https://localhost:${httpsPort}${req.url}`,
      });
      res.end();
    })
    .listen(httpPort);
};
