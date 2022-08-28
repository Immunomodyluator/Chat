document.getElementsByClassName('button-register')[0].addEventListener('click', register);
document.getElementsByClassName('button-login')[0].addEventListener('click', login);
document
  .getElementsByClassName('register-select')[0]
  .addEventListener('click', function () {
    formSelect('register');
  });
document.getElementsByClassName('login-select')[0].addEventListener('click', function () {
  formSelect('login');
});

function createDiv(result) {
  const element = document.getElementsByClassName('result')[0];
  element.innerHTML = '';
  let newElem = document.createElement('div');
  let newElemText = document.createTextNode(result);
  newElem.appendChild(newElemText);
  element.appendChild(newElem);
}

function formSelect(choice) {
  const registerForm = document.getElementsByClassName('registration')[0];
  const loginForm = document.getElementsByClassName('login')[0];

  switch (choice) {
    case 'register':
      registerForm.style.display = 'flex';
      loginForm.style.display = 'none';
      break;
    case 'login':
      registerForm.style.display = 'none';
      loginForm.style.display = 'flex';
      break;
  }
}

function login() {
  const email = document.getElementsByClassName('login-email')[0].value;
  const login = document.getElementsByClassName('login-login')[0].value;
  const password = document.getElementsByClassName('login-password')[0].value;

  axios
    .post('/login', { login: login, password: password, email: email })
    .then((success) => {
      const login = success.data.login;
      alert(`Вы авторизовались. Ваш логин : ${login}`);
      setTimeout((window.location.href = '/'), 50000);
    })
    .catch((error) => {
      createDiv(`${error.response.data}`);
    });
}

function register() {
  const email = document.getElementsByClassName('register-email')[0].value;
  const login = document.getElementsByClassName('register-login')[0].value;
  const password = document.getElementsByClassName('register-password')[0].value;

  axios
    .post('/register', { login: login, password: password, email: email })
    .then((success) => {
      createDiv(`Логин ${JSON.stringify(success.data)} - УСПЕШНО ЗАРЕГИСТРИРОВАН`);
      setTimeout((window.location.href = '/'), 50000);
    })
    .catch((error) => {
      createDiv(`Логин ${login} уже зарегистрирован.`);
    });
}
