function download() {
  alert("다운받기");
}

document.addEventListener("DOMContentLoaded", () => {
  const congrats = document.getElementById("congrats_box");
  const form = document.getElementById("birthday_form");

  form.onsubmit = (event) => {
    event.preventDefault();

    const data = new FormData(form);
    const person = data.get('person');
    const gift = data.get('gift');

    alert(`${person}에게 ${gift}을 선물로 드릴게요.`);
    congrats.style.display = 'block';
  }
});
