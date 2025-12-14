let audio;

export const playWinSound = () => {
  try {
    if (!audio) {
      audio = new Audio("/sounds/win.mp3");
      audio.volume = 0.6;
    }
    audio.currentTime = 0;
    audio.play();
  } catch (err) {
    console.warn("Sound blocked by browser");
  }
};
