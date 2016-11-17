import "./application.scss";

import * as services from "./services";

// PLAYGOUND

// services.server.on$('test')
//   .map(d => d + ' whoa')
//   .subscribe(item => {
//     console.log('got ' + item);
//   });

services.server.status$
  .subscribe(status => console.log(status));

services.server.emitAction$('login', { username: 'foo', password: 'bar' })
  .subscribe(result => {
    if (result.error)
      console.log(result.error);
    else
      console.log('Logged In!');
  });

// AUTH


// COMPONENTS


// BOOTSTRAP
services.socket.connect();