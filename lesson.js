const slides = Array.from(document.querySelectorAll(".slide"));
const counter = document.getElementById("counter");
const audioPlayer = new Audio();
let index = 0;

function showSlide(nextIndex) {
  index = Math.max(0, Math.min(slides.length - 1, nextIndex));
  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === index);
    if (slideIndex === index) slide.scrollTop = 0;
  });
  counter.textContent = `${index + 1} / ${slides.length}`;
}

function speak(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.78;
  utterance.pitch = 1;
  window.speechSynthesis.speak(utterance);
}

async function playAudio(item) {
  const audioPath = item.dataset.audio;
  if (!audioPath) {
    speak(item.dataset.say);
    return;
  }
  try {
    window.speechSynthesis?.cancel();
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    audioPlayer.src = audioPath;
    await audioPlayer.play();
  } catch (error) {
    speak(item.dataset.say);
  }
}

async function startLandscapeMode() {
  document.getElementById("landscapeHelp").classList.add("dismissed");
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
  } catch (error) {}
  try {
    if (screen.orientation?.lock) await screen.orientation.lock("landscape");
  } catch (error) {}
}

document.getElementById("prev").addEventListener("click", () => showSlide(index - 1));
document.getElementById("next").addEventListener("click", () => showSlide(index + 1));
document.getElementById("fullscreen").addEventListener("click", startLandscapeMode);
document.getElementById("startLandscape").addEventListener("click", startLandscapeMode);
document.getElementById("dismissLandscape").addEventListener("click", () => {
  document.getElementById("landscapeHelp").classList.add("dismissed");
});
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight" || event.key === " ") showSlide(index + 1);
  if (event.key === "ArrowLeft") showSlide(index - 1);
});
document.querySelectorAll("[data-say]").forEach((item) => {
  item.addEventListener("click", () => playAudio(item));
});
