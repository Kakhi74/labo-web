export class Toast {
  constructor(type, text, container) {
    this.type = type;
    this.text = text;
    this.container = container;
  }

  toast() {
    const toast = document.createElement("div");
    toast.className = `toast-${this.type}`;
    toast.innerText = this.text;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
}
