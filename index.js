const http = require('http'),
      https = require('https'),
      httpProxy = require('http-proxy');
  
const fs = require('fs');

require('dotenv').config();

const options = {
    key: fs.readFileSync(process.env.SSL_PRIVATE_KEY),
    cert: fs.readFileSync(process.env.SSL_CERTIFICATE)
  };


proxy = httpProxy.createProxy();

https.createServer( options, (req, res) => {
        if (req.headers.host === process.env.WWW_HOST_A) {
          proxy.web(req, res, {target: process.env.LOCALHOST_TARGET_FOR_HOST_A});
        }
        if (req.headers.host === process.env.WWW_HOST_B) {
          proxy.web(req, res, {target: process.env.LOCALHOST_TARGET_FOR_HOST_B});
        }
}).listen(process.env.PORT_HTTP);


http.createServer( (req, res) => {
//////////////////////////// HSTS redirect from HTTP to HTTPS ///////////////////////
    res.statusCode = 301;
    res.setHeader('Location', 'https://' + req.headers.host.split(':')[0] + req.url);
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    return res.end();
}).listen(process.env.PORT_HTTPS);






 