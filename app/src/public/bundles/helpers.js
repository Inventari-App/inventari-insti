"use strict";
(() => {
  // src/bundles/helpers.ts
  function localizeBoolean(val) {
    return val ? "Si" : "No";
  }
  window.localizeBoolean = localizeBoolean;
})();
