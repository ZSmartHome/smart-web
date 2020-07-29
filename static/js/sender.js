'use strict';

const sendCommand = (data) => fetch(`/command`, {
  method: `POST`,
  headers: {
    'Accepts': 'application/json'
  },
  body: data
});

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
    const data = new URLSearchParams();
    data.append(submitter.name, submitter.value);
    const enable = () => submitter.disabled = false;
    sendCommand(data)
      .then((it) => console.log(it))
      .then(enable).catch(enable);
  })
}