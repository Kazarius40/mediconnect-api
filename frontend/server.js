const https = require('https');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const httpsOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem')),
};

app.prepare().then(() => {
  https
    .createServer(httpsOptions, (req, res) => {
      void handle(req, res);
    })
    .listen(3001, () => {
      console.log('> HTTPS Server ready on https://localhost:3001');
    });
});
