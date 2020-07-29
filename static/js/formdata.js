// grab reference to form
"use strict";

(function () {
  const listen = (formElem, listener) => {
    // submit handler

    formElem.addEventListener(`submit`, (e) => {
      // on form submission, prevent default
      e.preventDefault();
      e.stopPropagation();

      // construct a FormData object, which fires the formdata event
      listener(e);
    });

  }

  window.formdata = {
    listen
  }
})();
