import "./application.scss";

import * as services from "./services";

// PLAYGOUND

services.server.on$('test')
  .map(d => d + ' whoa')
  .subscribe(item => {
    console.log('got ' + item);
  });

services.server.status$
  .subscribe(status => console.log(status));

// AUTH


// COMPONENTS


// BOOTSTRAP
services.socket.connect();