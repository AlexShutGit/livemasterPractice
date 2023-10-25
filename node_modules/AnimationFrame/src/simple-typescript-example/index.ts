"use strict";
declare let require: any;
require("./index.html");

import AnimationFrame from "../../lib/AnimationFrame.ts";

AnimationFrame.subscribe(this, () => {
  document.body.innerText = (new Date()).getTime().toString();
});

AnimationFrame.parallelSubscribe({
  callback: () => {
    document.body.innerText = (new Date()).getTime().toString();
  },
});

for (let i = 0; i < 1000; i++) {
  AnimationFrame.serialSubscribe({
    callback: () => {
      document.body.innerText = (new Date()).getTime().toString();
    },
  });
}
