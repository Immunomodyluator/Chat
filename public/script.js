window.onload = function() {
  socket = io.connect('noir.sknt.ru')
  let messages = document.getElementById("chatHistory");
  let online = document.getElementById("sideBarBody");

  function textSend () {
    let inputText = document.getElementById("chatInput__text")
    socket.emit('chat message', inputText.textContent)
    inputText.textContent = ""
  }

  document.getElementById("chatInput__svgWrap").addEventListener("click", () => {
    textSend()
  })
  document.getElementById("chatInput__text").addEventListener("keydown", (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      textSend()
    }
  })

  socket.on('usersHTML', function(usersHTML) {
      online.innerHTML=usersHTML;
  })

  socket.on('chat message', function(msg) {
    let item = document.createElement('div')
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
  })
}
