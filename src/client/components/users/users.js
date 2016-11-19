import $ from "jquery";
import { ElementComponent } from "../../lib/component";
import { usersStore } from "../../services";

import "./users.scss";

class UsersComponent extends ElementComponent {
  constructor(usersStore) {
    super('ul');
    this.$element.addClass('users');

    this._users = usersStore;
  }

  _onAttach() {
    const $title = this._$mount.find('> h1');
    $title.text('Users');

    this._users.state$
      .map(action => action.state.users)
      .compSubscribe(this, users => {
        console.log('got new state');

        if (users.length != 1)
          $title.text(`${users.length} users`);
        else
          $title.text(`${users.length} user`);

        this.$element.empty();
        for (let user of users) {
          const $name = $('<span class="name" />').text(user.name).css('color', user.color);
          const $userElement = $('<li />').append($name);
          this.$element.append($userElement);
        }
      });
  }
}

let component;
try {
  component = new UsersComponent(usersStore);
  component.attach($('section.users'));
} catch (e) {
  console.error(e);
  if (component)
    component.detach();
} finally {
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => component && component.detach());
  }
}