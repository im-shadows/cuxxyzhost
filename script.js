const texts = ["Ress murni 2026"];
let index = 0;
let char = 0;
let isDeleting = false;

const el = document.getElementById("typing-text");

function typingEffect() {
  const current = texts[index];
  if (!isDeleting) {
    el.textContent = current.substring(0, char++);
    if (char > current.length) {
      setTimeout(() => isDeleting = true, 1200);
    }
  } else {
    el.textContent = current.substring(0, char--);
    if (char < 0) {
      isDeleting = false;
      char = 0;
    }
  }
  setTimeout(typingEffect, isDeleting ? 70 : 120);
}

typingEffect();