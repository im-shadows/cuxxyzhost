const text = "Ress murni 2026";
const speed = 120;
const eraseSpeed = 80;
const delay = 1500;

let index = 0;
let isDeleting = false;
const typingEl = document.getElementById("typing-text");

function typeEffect() {
  if (!isDeleting && index <= text.length) {
    typingEl.textContent = text.substring(0, index++);
  } else if (isDeleting && index >= 0) {
    typingEl.textContent = text.substring(0, index--);
  }

  if (index === text.length + 1) {
    setTimeout(() => (isDeleting = true), delay);
  }

  if (isDeleting && index === 0) {
    isDeleting = false;
  }

  setTimeout(typeEffect, isDeleting ? eraseSpeed : speed);
}

typeEffect();