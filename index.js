function download() {
  alert("다운받기");
}

function display(form, event) {
  event.preventDefault();

  const data = new FormData(form);
  const person = data.get('person');
  const gift = data.get('gift');

  alert(`${person}에게 ${gift}을 선물로 드릴게요.`);
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("birthday_form");
  const button = document.getElementById("download_button");

  button.onclick = () => download();
  form.onsubmit = (event) => display(form, event)
});
