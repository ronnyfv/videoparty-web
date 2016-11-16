'use strict';

let socket = io();

let chatInput = document.querySelector('.chat-form input[type=text]');
chatInput.addEventListener('keypress', event => {
  if (event.keyCode !== 13)
    return;
  event.preventDefault();

  let text = event.target.value.trim();
  if (text.length === 0)
    return;

  socket.emit('chat:add', {
    message: text
  });

  event.target.value = '';
});

let chatList = document.querySelector('.chat-list ul');


socket.on('chat:added', data => {
  let messageElement = document.createElement('li');
  messageElement.innerText = data.message;

  chatList.appendChild(messageElement);
  chatList.scrollTop = chatList.scrollHeight;
});