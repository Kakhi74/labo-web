import { Toast } from "./toast.js";

const buttons = [...document.getElementsByClassName("toast-button")];
const input = document.getElementById("toast-input");

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    if (input.value.length !== 0) {
      const toast = new Toast(
        e.target.dataset.type,
        input.value,
        document.getElementById("toast-container")
      );
      toast.toast();
    }
  });
});
