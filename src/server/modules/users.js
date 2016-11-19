import _ from "lodash";
import { Observable } from "rxjs";
import { ModuleBase } from "../lib/module";
import { validateLogin } from "../../shared/validation/users";
import { fail } from "../../shared/observable-socket";

const AuthContext = Symbol("AuthContext");

export class UsersModule extends ModuleBase {
  constructor(io) {
    super();
    this._io = io;
    this._userList = [];
    this._users = {};
  }

  getUserForClient(client) {
    const auth = client[AuthContext];

    if (!auth)
      return null;

    return auth.isLoggedIn ? auth : null;
  }

  logoutClient(client) {
    const auth = this.getUserForClient(client);

    if (!auth)
      return;

    const index = this._userList.indexOf(auth);
    this._userList.splice(index, 1);

    delete this._users[auth.username];
    delete client[AuthContext];

    this._io.emit('users:removed', auth);
    console.log(`User ${auth.username} logged out`);
  }

  loginClient$(client, username) {
    username = username.trim();

    const validator = validateLogin(username);
    if (!validator.isValid)
      return validator.throw$();

    if (this._users.hasOwnProperty(username))
      return fail(`Username ${username} is already taken`);

    const auth = client[AuthContext] || (client[AuthContext] = {});
    if (auth.isLoggedIn)
      return fail('You already logged in');

    auth.username = username;
    auth.color = this.getColorForUsername(username);
    auth.isLoggedIn = true;

    this._users[username] = client;
    this._userList.push(auth);

    this._io.emit('users:added', auth);
    console.log(`User ${username} logged in`);
    return Observable.of(auth);
  }

  getColorForUsername(username) {
    let hash = _.reduce(username,
      (hash, ch) => ch.charCodeAt(0) + (hash << 6) + (hash << 16) - hash, 0);

    hash = Math.abs(hash);
    const hue = hash % 360;
    const saturation = hash % 25 + 70;
    const lightness = 100 - (hash % 15 + 35);

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  registerClient(client) {
    client.onActions({
      'users:list': () => {
        return this._userList;
      },

      'auth:login': ({ username }) => {
        return this.loginClient$(client, username);
      },

      'auth:logout': () => {
        this.logoutClient(client);
      }
    });

    client.on('disconnected', () => {
      this.logoutClient(client);
    });
  }
}