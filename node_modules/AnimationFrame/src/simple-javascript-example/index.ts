"use strict";
require("./index.html");

let AnimationFrame = require("../../lib/AnimationFrame.ts");

AnimationFrame.subscribe(this, () => {
  document.body.innerText = (new Date()).getTime().toString();
});