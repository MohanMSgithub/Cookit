const titles = [
  "WELCOME",
  "DISCOVER RECIPES",
  "COOK WITH CONFIDENCE"
];

const texts = [
  "You can now cook your own food and master the art of cooking.",
  "Explore a wide variety of delicious recipes tailored to your taste.",
  "Follow step-by-step instructions and improve your cooking skills."
];

let currentIndex = 0;
const titleEl = document.getElementById("onboarding-title");
const textEl = document.getElementById("onboarding-text");
const dots = document.querySelectorAll(".dot");

function nextSlide() {
  currentIndex++;
  if (currentIndex >= titles.length) {
    window.location.href = "login.html";
    return;
  }

  titleEl.textContent = titles[currentIndex];
  textEl.textContent = texts[currentIndex];

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

// Call this function on "Next" button click
document.getElementById("nextBtn").addEventListener("click", nextSlide);
