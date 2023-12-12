const socket = io("http://localhost:3000");

const form = document.getElementById('form');
const input = document.getElementById('input');
const nameInput = document.getElementById('name-input');
const messages = document.getElementById('messages');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value && nameInput.value) {
    socket.emit('chat message', nameInput.value, input.value);
    input.value = '';
  }
});

socket.on('chat message', (name, message) => {
  const item = document.createElement('li');
  item.textContent = `${name}: ${message}`;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});