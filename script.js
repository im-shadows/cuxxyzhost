const texts = ["Ress murni 2026", "Result masa kini"];
let textIndex = 0;
let charIndex = 0;
let deleting = false;

const el = document.getElementById("typing-text");

function typingLoop() {
  const current = texts[textIndex];

  if (!deleting) {
    el.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      setTimeout(() => deleting = true, 1200);
    }
  } else {
    el.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      deleting = false;
      textIndex = (textIndex + 1) % texts.length;
      charIndex = 0;
    }
  }

  setTimeout(typingLoop, deleting ? 70 : 120);
}

typingLoop();