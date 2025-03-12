function getGift(name) {
  alert(`${name}을 선물로 드릴게요.`);
}

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("gift_input");

  input.addEventListener("blur", (e) => getGift(e.target.value));
});
