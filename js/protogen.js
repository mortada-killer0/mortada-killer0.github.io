document.addEventListener('mousemove', (e) => {
  const mouseX = e.clientX;
  const mouseY = e.clientY;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const mouseProgressX = Math.min(1, Math.max(-1, (((mouseX + head.offsetWidth) / windowWidth) * 2) - 1));
  const mouseProgressY = Math.min(1, Math.max(-1, (((mouseY - head.offsetHeight) / windowHeight) * 2) - 1));

  // Use the progress value to apply styles or transformations
  document.body.style.setProperty('--mouse-progress-x', mouseProgressX);
  document.body.style.setProperty('--mouse-progress-y', mouseProgressY);
});

const head = document.getElementById('head');
const eyes = document.getElementById('eyes');
const nose = document.getElementById('nose');
const mouth = document.getElementById('mouth');

nose.onclick = () => {
  giggle();
}

eyes.onclick = () => {
  blink();
}

let isGiggly = false;

function blink() {
  if (isGiggly) {
    return;
  }

  setTimeout(() => {
    eyes.style.transition = 'scale 0.1s ease';
    eyes.style.scale = '1 0.25';
    setTimeout(() => {
      eyes.style.transition = '';
      eyes.style.scale = '1 1';
      eyes.src = '/style/images/protogen/eyes_closed.png';
      setTimeout(() => {
        eyes.style.scale = '1 0.25';
        setTimeout(() => {
          eyes.style.transition = 'scale 0.1s ease';
        }, 1);
        if (isGiggly) {
          eyes.src = '/style/images/protogen/eyes_open.png';
        } else {
          eyes.src = '/style/images/protogen/eyes_smiley_open.png';
        }
        setTimeout(() => {
          eyes.style.transition = '';
          eyes.style.scale = '1 1';
        }, 110);
      }, 50);
    }, 100);
    blink();
  }, 5000 * Math.random());
}

function giggle() {
  isGiggly = true;
  mouth.style.transition = 'scale 0.3s cubic-bezier(0.5, 0.8, 0, 1)';
  mouth.style.scale = '1 2';
  mouth.src = '/style/images/protogen/mouth_smile.png';
  setTimeout(() => {
    mouth.style.transition = '';
    mouth.style.scale = '1 1';
    mouth.src = '/style/images/protogen/mouth_open.png';
    eyes.src = '/style/images/protogen/eyes_smiley_open.png';

    setTimeout(() => {
      mouth.style.transition = 'all 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.5)';
      nose.style.transition = 'translate 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.5) 0.025s';
      eyes.style.transition = 'translate 0.3s cubic-bezier(0.2, 0.9, 0.1, 1.5) 0.05s';
      head.style.transition = 'rotate 0.5s cubic-bezier(0.2, 0.9, 0.1, 1.5) 0.075s';
    }, 1);
    setTimeout(() => {
      mouth.style.scale = '1 0.5';
      mouth.style.translate = '0 0';
      nose.style.translate = '0 -50%';
      eyes.style.translate = '0 -20%';
      head.style.rotate = '1deg';
      setTimeout(() => {
        mouth.style.scale = '1 1';
        mouth.style.translate = '0 10%';
        nose.style.translate = '0 0';
        eyes.style.translate = '0 0';
        head.style.rotate = '-1deg';
        setTimeout(() => {
          mouth.style.scale = '1 0.5';
          mouth.style.translate = '0 0';
          nose.style.translate = '0 -50%';
          eyes.style.translate = '0 -20%';
          head.style.rotate = '1deg';
          setTimeout(() => {
            mouth.style.scale = '1 1';
            mouth.style.translate = '0 10%';
            nose.style.translate = '0 0';
            eyes.style.translate = '0 0';
            head.style.rotate = '-1deg';
            setTimeout(() => {
              mouth.style.scale = '1 0.5';
              mouth.style.translate = '0 0';
              nose.style.translate = '0 -50%';
              eyes.style.translate = '0 -20%';
              head.style.rotate = '1deg';
              setTimeout(() => {
                mouth.style.scale = '1 1';
                mouth.style.translate = '0 10%';
                nose.style.translate = '0 0';
                eyes.style.translate = '0 0';
                head.style.rotate = '0deg';
              }, 200);
            }, 200);
          }, 200);
        }, 200);
      }, 200);
    }, 200);
    setTimeout(() => {
      mouth.style.scale = '1 2';
      mouth.src = '/style/images/protogen/mouth_smile.png';
      setTimeout(() => {
        mouth.style.transition = 'all 0.3s cubic-bezier(0.5, 0.8, 0, 1)';
      }, 1);
      setTimeout(() => {
        mouth.style.transition = '';
        nose.style.transition = '';
        mouth.style.scale = '1 1';
        mouth.style.translate = '0 0';
        mouth.src = '/style/images/protogen/mouth_closed.png';
        isGiggly = false;
      }, 110);
    }, 2000);
  }, 150);
}

blink();
