import "source-map-support/register";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";

// **************************************************
// HELPERS
const isDevelopment = process.env.NODE_ENV !== 'production';


// **************************************************
// SETUP
const app = express();
const server = new http.Server(app);
const io = socketIo(server);


// **************************************************
// CLIENT WEBPACK
if (process.env.USE_WEBPACK === "true") {
  let webpackMiddleware = require("webpack-dev-middleware");
  let webpack = require("webpack");
  let webpackHotMiddleware = require("webpack-hot-middleware");
  let clientConfig = require("../../webpack.client");

  const compiler = webpack(clientConfig);
  app.use(webpackMiddleware(compiler, {
    publicPath: '/build/',
    stats: {
      colors: true,
      chunks: false,
      assets: false,
      timings: false,
      modules: false,
      hash: false,
      version: false
    }
  }));

  app.use(webpackHotMiddleware(compiler));
  console.log(chalk.bgRed('Using Webpack Dev Middleware! (DEV ONLY)'));
}


// EXPRESS CONFIGS
app.set('views', './src/server/views');
app.set('view engine', 'hbs');
app.use(express.static('public'));

const useExternalStyles = !isDevelopment;

app.get('/', (req, res) => {
  res.render('index', {
    useExternalStyles
  });
});


// **************************************************
// MODULES


// **************************************************
// SOCKET
io.on('connection', socket => {
  console.log(`Got connection from ${socket.request.connection.remoteAddress}`);

  let index = 0;
  setInterval(() => {
    socket.emit('test', `On index ${index++}`);
  }, 5000);
});

// **************************************************
// STARTUP
const port = process.env.PORT || 3000;

function startServer() {
  server.listen(port, () => {
    console.log(`Started http server on ${port}`);
  });
}

startServer();