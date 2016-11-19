import "source-map-support/register";
import express from "express";
import http from "http";
import socketIo from "socket.io";
import chalk from "chalk";
import { Observable } from "rxjs";
import "shared/operators";
import { ObservableSocket } from "shared/observable-socket";


import { UsersModule } from "./modules/users";
import { PlaylistModule } from "./modules/playlist";
import { ChatModule } from "./modules/chat";

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
// SERVICES
const videoServices = [];
const playlistRepository = {};

// **************************************************
// MODULES
const users = new UsersModule(io);
const chat = new ChatModule(io, users);
const playlist = new PlaylistModule(io, users, playlistRepository, videoServices);

const modules = [users, chat, playlist];

// **************************************************
// SOCKET
io.on('connection', socket => {
  console.log(`Got connection from ${socket.request.connection.remoteAddress}`);

  const client = new ObservableSocket(socket);

  for (let mod of modules) {
    mod.registerClient(client);
  }

  for (let mod of modules) {
    mod.clientRegistered(client);
  }

  client.onAction('login', credentials => {
    return Observable.of(`User: ${credentials.username}`).delay(3000);
  });

});

// **************************************************
// STARTUP
const port = process.env.PORT || 3000;

function startServer() {
  server.listen(port, () => {
    console.log(`Started http server on ${port}`);
  });
}

Observable.merge(...modules.map(m => m.init$()))
  .subscribe({
    complete(){
      startServer();
    },
    error(error){
      console.error(`Could not init module: ${error.stack || error}`);
    }
  });