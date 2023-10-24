"use strict";
/**
 * Import interfaces
 */
import IWindow from "../interfaces/IWindow";
/**
 * Declare window interface
 */
declare let window: IWindow;
declare let global: any;
declare let require: any;

class Root implements IWindow {
}

let root: IWindow;

if (typeof window === "undefined") {
  if (typeof global !== "undefined") {
    root = global;
  } else {
    root = new Root();
  }
} else {
  root = window;
}

if (!root.Promise) {
  root.Promise = require("promise-polyfill");
}

/**
 * requestAnimationFrame polyfill
 */
root.requestAnimationFrame = (() => {
  return (
          typeof root !== "undefined" &&
          (
              root.requestAnimationFrame ||
              root.webkitRequestAnimationFrame ||
              root.mozRequestAnimationFrame ||
              root.oRequestAnimationFrame ||
              root.msRequestAnimationFrame
          )
      ) ||
      (
          (callback) => {
            root.setTimeout(callback, 1000 / 60);
          }
      );
})();

/**
 * Bind polyfill
 */
function bind(b) {
  /**
   * If try bind variable that not a function, then throw error
   */
  if (typeof this !== "function") {
    throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
  }
  /**
   * let Array slice function
   */
  const a = Array.prototype.slice;
  const f = a.call(arguments, 1);
  const e = this;

  function c() {
  }

  function d() {
    return e.apply(this instanceof c ? this : b || root, f.concat(a.call(arguments)));
  }

  /**
   * Registered this prototype as prototype to bind implementation functions
   */
  c.prototype = this.prototype;
  d.prototype = new c();
  /**
   * Return bind polyfill
   */
  return d;
}

Function.prototype.bind = Function.prototype.bind || bind;

/**
 * Object.keys polyfill
 */
function keys() {
  const hasDoNotEnumBug = !({toString: null}).propertyIsEnumerable("toString");

  const doNotEnums = [
    "toString",
    "toLocaleString",
    "valueOf",
    "hasOwnProperty",
    "isPrototypeOf",
    "propertyIsEnumerable",
    "constructor",
  ];

  const doNotEnumsLength = doNotEnums.length;

  return (
      (obj) => {
        if (typeof obj !== "object" && (typeof obj !== "function" || obj === null)) {
          throw new TypeError("Object.keys called on non-object");
        }

        const result = [];

        for (const prop in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }

        if (hasDoNotEnumBug) {
          for (let i = 0; i < doNotEnumsLength; i++) {
            if (Object.prototype.hasOwnProperty.call(obj, doNotEnums[i])) {
              result.push(doNotEnums[i]);
            }
          }
        }

        return result;
      }
  );
}

Object.keys = Object.keys || keys();

export default root;
