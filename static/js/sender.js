'use strict';

const sendCommand = (evt) => {
  evt.preventDefault();
  evt.stopPropagation();

  const target = evt.target;
  fetch(`/command`, {
    method: `POST`,
    headers: {
      'Accepts': 'application/json',
      'Content-Type': 'application/json'
    },
    body: target.value
  })
    .then((it) => console.log(it))
    .catch((it) => console.error(it))
};

const buttons = document.querySelectorAll(`button`);

for (const button of buttons) {
  // button.addEventListener(`click`, sendCommand);
}