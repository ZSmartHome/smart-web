'use strict';

const sendCommand = (data) => fetch(`/command`, {
  method: `POST`,
  headers: {
    'Accepts': 'application/json',
    'Content-Type': 'application/json'
  },
  body: data
})
  .then((it) => console.log(it))
  .catch((it) => console.error(it));

const listenOn = (target = window, regexp, listener) => {
  Object.keys(target).forEach(key => {
    if (regexp.test(key)) {
      window.addEventListener(key.slice(2), listener);
    }
  });
}

listenOn(window, /^on(?!(mouse|pointer))/, (it) => console.log(it.type));


const forms = document.querySelectorAll(`form`);
for (const form of forms) {
  window.formdata.listen(form, ({submitter}) => {
    submitter.disabled = true;
    const data = new FormData();
    data.append(submitter.name, submitter.value);
    const enable = () => submitter.disabled = false;
    sendCommand(data).then(enable).catch(enable);
  })
}