'use strict';

const sendCommand = (data) => fetch(`/command`, {
  method: `POST`,
  headers: {
    'Accepts': `application/json`
  },
  body: data
}).then((resp) => {
  if (resp.ok) {
    return resp;
  }
  throw resp;
});

const onResponse = async (e) => {
  console.log(e);
  console.log(await e.text());
  debugger;
}

const onFail = (e) => {
  console.error(e);
  if (typeof e.ok === `boolean`) {
    // Got response with code > 200
    // handle
    const contentType = e.headers.get('content-type');
    console.error(`Got content-type: ${contentType}`);
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError("Oops, we haven't got JSON!");
    }
  } else {
    // Handle other case
  }

}

const forms = document.querySelectorAll(`form`);
for (const form of forms) {
  window.formdata.listen(form, ({submitter}) => {
    submitter.disabled = true;
    const enable = () => submitter.disabled = false;

    const data = new URLSearchParams();
    data.append(submitter.name, submitter.value);
    sendCommand(data)
      .then(onResponse)
      .catch(onFail).then(enable);
  })
}