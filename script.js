const texts = [
  "Ress murni 2026",
  "Result masa kini"
];

let textIndex = 0;
let charIndex = 0;
let deleting = false;

const el = document.getElementById("typing-text");

function typingLoop() {
  const text = texts[textIndex];

  if (!deleting) {
    el.textContent = text.substring(0, charIndex++);
    if (charIndex > text.length) {
      setTimeout(() => deleting = true, 1500);
    }
  } else {
    el.textContent = text.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
      charIndex = 0;
    }
  }

  setTimeout(typingLoop, deleting ? 70 : 110);
}

typingLoop();