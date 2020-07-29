'use strict';

(function () {
  const sendCommand = (data) => fetch(`/command`, {
    method: `POST`,
    headers: {
      'Accept': `application/json`
    },
    body: data
  }).then(async (resp) => {
    if (resp.ok) {
      return resp.json();
    }
    throw await resp.json();
  });

  const showStatus = window.statusDialog.show;

  const onSuccess = async (data) => {
    console.log(data);
    showStatus(`Success!`, 500);
  }

  const onFail = (e) => {
    if (e.status === `Error`) {
      // Error is valid error from server
      // handle
      console.error(e);
      showStatus(`Error: ${e.message}`);
    } else {
      // Handle other case
      console.error(e);
      showStatus(`Error!`);
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
        .then(onSuccess)
        .catch(onFail).then(enable);
    })
  }
})();