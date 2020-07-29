'use strict';

(function () {
  const status = document.getElementById(`status`);
  const statusContent = status.querySelector(`.status__content h1`);

  let currentAnimation;
  const ERROR_TIMEOUT = 3000; // 3s

  const hide = () => {
    status.classList.remove(`status--slide`);
    status.style.display = 'none';
  }

  const endAnimationListener = () => {
    hide();
    status.removeEventListener('animationend', endAnimationListener);
  };

  const animate = (wait = ERROR_TIMEOUT) => {
    status.style.display = 'block';
    // Remove animation if currently is shown
    status.classList.remove(`status--slide`);

    if (currentAnimation) {
      clearTimeout(currentAnimation);
    }
    currentAnimation = setTimeout(() => {
      status.addEventListener('animationend', endAnimationListener, false);

      status.classList.add(`status--slide`);
    }, wait);
  };

  status.addEventListener(`click`, hide);

  const showStatus = (text, wait = ERROR_TIMEOUT) => {
    statusContent.textContent = text;

    animate(wait);
  }

  window.statusDialog = {show: showStatus};
})();