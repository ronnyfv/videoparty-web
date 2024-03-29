import "shared/operators";
import * as services from "./services";

import "./application.scss";

// PLAYGOUND

// services.server.on$('test')
//   .map(d => d + ' whoa')
//   .subscribe(item => {
//     console.log('got ' + item);
//   });

services.server.status$.subscribe(status => console.log(status));

// services.server.emitAction$('login', { username: 'foo', password: 'bar' })
//   .subscribe(user => {
//     console.log('Logged In! ' + user);
//   }, error => {
//     console.error(error);
//   });

// AUTH


// COMPONENTS
require("./components/player/player");
require("./components/users/users");
require("./components/chat/chat");
require("./components/playlist/playlist");

// BOOTSTRAP
services.socket.connect();

services.usersStore.login$('whoa')
  .subscribe(user => {
    console.log(user);
  });