'use strict';

(function () {
  /**
   * Listen on event by pattern
   *
   * Usage example:
   * ```javascript
   * listenOn(window, /^on(?!(mouse|pointer))/, (it) => console.log(it.type));
   * ```
   **/
  const listenOn = (target = window, regexp, listener) => {
    Object.keys(target).forEach(key => {
      if (regexp.test(key)) {
        window.addEventListener(key.slice(2), listener);
      }
    });
  }

  window.util = {listenOn}
})()