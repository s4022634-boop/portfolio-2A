document.addEventListener("DOMContentLoaded", () => {
  const character = document.querySelector(".character");
  const face = document.querySelector(".face-default"); 
  const speech = document.getElementById("speech");

  const phrases = [
    "Hi! I'm ███████",
    "Tip: Don't touch me",
    "How are you?",
    "Are you feeling lucky?"
  ];


  const ticklePhrases = [
    "Hey! That tickle!",
    "Haha! Stop it!",
    "Seriously! I can't!"
  ];

  let clickCount = 0;
  let tickleTimeout = null;
  let revertTimeout = null;
  let locked = false;


  let stopSpeechFlag = false;

  let rafId = null;
  const bloodSettings = {
    width: "280px",
    translateX: "-20px",
    translateY: "120px"
  };

  // --- AUDIO SETUP ---
  const laughSound = new Audio("image/audio_laugh.mp3");
  laughSound.preload = "auto";
  laughSound.volume = 0.8;

  const bangSound = new Audio("image/audio_bang.mp3");
  bangSound.preload = "auto";
  bangSound.volume = 1.0;

  function showTemporarySpeech(text, duration = 1000) {
    if (locked) return;
    if (!speech) return;

    speech.textContent = text;
    speech.classList.add("visible");

    if (tickleTimeout) clearTimeout(tickleTimeout);
    tickleTimeout = setTimeout(() => {
      speech.classList.remove("visible");
      tickleTimeout = null;
    }, duration);
  }

  function swapFaceTemporarily(newSrc, duration = 1000) {
    if (!face) return;
    if (face.dataset.blood === "true") return;
    if (revertTimeout) {
      clearTimeout(revertTimeout);
      revertTimeout = null;
    }

    const previous = face.src;
    face.src = newSrc;

    revertTimeout = setTimeout(() => {
 
      if (!face.dataset.blood) {
        face.src = previous.includes("face_default") ? previous : "image/face_default.png";
      }
      revertTimeout = null;
    }, duration);
  }


  function clearAllTimeouts() {
    if (tickleTimeout) {
      clearTimeout(tickleTimeout);
      tickleTimeout = null;
    }
    if (revertTimeout) {
      clearTimeout(revertTimeout);
      revertTimeout = null;
    }
  }


  function handleTickleClick() {
    if (locked) return;

    clickCount += 1;

    if (clickCount >= 1 && clickCount <= 3) {
      // --- PLAY LAUGH SOUND ---
      try {
        laughSound.currentTime = 0;
        laughSound.play();
      } catch (e) {}

      const text = ticklePhrases[clickCount - 1];
      showTemporarySpeech(text, 1000);
      swapFaceTemporarily("image/face_tickled.png", 1000);

    } else if (clickCount === 4) {
      // --- PLAY BANG SOUND ---
      try {
        bangSound.currentTime = 0;
        bangSound.play();
      } catch (e) {}
      clearAllTimeouts();

      face.dataset.blood = "true";
      face.src = "image/blood.png"
      face.classList.add("face-blood");
  
      if (bloodSettings.width) {
        face.style.width = bloodSettings.width;
        face.style.height = "auto";
      }
      face.style.transform = `translate(${bloodSettings.translateX}, ${bloodSettings.translateY})`;


      face.classList.remove("talking");

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }

      try {
        if (face) {
          face.style.animation = "none";
          face.style.transition = "none";
          face.style.willChange = "auto";
        }
        if (character) {
          character.style.animation = "none";
          character.style.transition = "none";
          character.style.willChange = "auto";
        }
      } catch (e) {

      }
      if (speech) {
        speech.classList.remove("visible");
        speech.style.display = "none";
      }
      stopSpeechFlag = true; 


      locked = true;
    }
  }

  function showSpeech() {
    if (locked || stopSpeechFlag) return; 

    const text = phrases[Math.floor(Math.random() * phrases.length)];
    if (speech) {
      speech.textContent = text;
      speech.classList.add("visible");
    }


    face.classList.add("talking");


    setTimeout(() => {
      if (!locked && speech) speech.classList.remove("visible");
    }, 3000);


    const duration = 3000; 
    const startTime = Date.now();

    function animateFace() {
      if (locked) {

        face.classList.remove("talking");
        return;
      }

      const style = window.getComputedStyle(face);
      const transform = style.transform;

      if (transform && transform !== "none") {
        let translateY = 0;

        if (transform.includes("matrix3d")) {
          const values = transform.match(/matrix3d\((.+)\)/)[1].split(", ");
          translateY = parseFloat(values[13]);
        } else if (transform.includes("matrix")) {
          const values = transform.match(/matrix\((.+)\)/)[1].split(", ");
          translateY = parseFloat(values[5]);
        }

        if (!face.dataset.blood && !face.src.includes("face_tickled")) {
          if (translateY > (face.lastY || 0)) {
            face.src = "image/face_talking.png";
          } else {
            face.src = "image/face_default.png";
          }
        }

        face.lastY = translateY;
      }

      if (Date.now() - startTime < duration) {
        rafId = requestAnimationFrame(animateFace);
      } else {
        if (!face.dataset.blood && !face.src.includes("face_tickled")) {
          face.src = "image/face_default.png";
        }
        face.classList.remove("talking");
        rafId = null;
      }
    }

    animateFace();
  }

  function randomInterval() {
    if (stopSpeechFlag) return;
    const delay = 7000 + Math.random() * 4000;
    setTimeout(() => {
      if (!stopSpeechFlag) {
        showSpeech();
        randomInterval();
      }
    }, delay);
  }
  randomInterval();

  if (face) face.addEventListener("click", handleTickleClick);
  if (character) character.addEventListener("click", (e) => {
    if (e.target !== face) handleTickleClick();
  });
});
