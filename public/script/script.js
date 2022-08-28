window.onload = function () {
  axios
    .get('/cookie')
    .then((success) => {
      if (success.data.length === 0) {
        alert('Вы не авторизованны!');
        setTimeout((window.location.href = '/authorization.html'), 5000);
      } else {
        alert(`Привет - ${success.data}`);
      }
    })
    .catch((err) => {
      console.log(err);
    });
  let messages = document.getElementById('chatHistory');
  let online = document.getElementById('sideBarBody');

  const socket = new WebSocket('ws://46.32.70.189');
  connect();

  function logout() {
    axios
      .get('/logout')
      .then(() => {
        socket.onclose = () => {
          socket.close();
          console.log('Соединение разорвано');
        };
        alert('До свидания');
        setTimeout((window.location.href = '/authorization.html'), 50000);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function sendMessage() {
    let inputText = document.getElementById('chatInput__text');
    const getCookieValue = (name) =>
      document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || '';
    const login = getCookieValue('login');
    const message = {
      username: login,
      message: inputText.textContent,
      id: Date.now(),
    };
    inputText.textContent = '';
    socket.send(JSON.stringify(message));
    return false;
  }

  function connect() {
    socket.onopen = function () {
      console.log('Подключение установленно!');
    };
  }

  socket.onmessage = function (message, uuid) {
    let item = document.createElement('div');
    let postMess = JSON.parse(message.data);
    item.textContent = `${postMess.username} : ${postMess.message}`;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  };

  document.getElementById('chatInput__svgWrap').addEventListener('click', () => {
    sendMessage();
  });

  document.getElementsByClassName('logout')[0].addEventListener('click', () => {
    logout();
  });

  document.getElementById('chatInput__text').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      sendMessage();
    }
  });
};
