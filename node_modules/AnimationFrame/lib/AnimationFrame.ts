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
declare let module: any;
declare let require: any;

import _package from "../package";

const VERSION = _package.version;

/**
 * Import interface
 */
import IAnimationFrame from "../interfaces/IAnimationFrame";

import root from "../polyfills/index";

/**
 * Request animation frame call stack class
 */
class AnimationFrame implements IAnimationFrame {

  public version: string;

  public parallelStack: any;
  public serialStack: any;
  public stack: any;

  public errorHandler: any;

  public serialID: number;

  /**
   * Create request animation frame
   */
  constructor() {
    this.version = VERSION;

    this.serialID = 0;
    /**
     * Subscribed methods
     */
    this.parallelStack = {};
    this.serialStack = {};
    /**
     * Backward compatibility
     */
    this.stack = this.parallelStack;
    /**
     * No error handler
     */
    this.errorHandler = null;
    /**
     * Start requestAnimationFrame watcher
     */
    this.watch();
  }

  /**
   * Subscribe method to watch
   * @param context
   * @param callback
   * @param params
   * @param ID
   * @return {boolean|string}
   */
  public subscribe(context: any = root,
                   callback: any = () => {
                     return null;
                   },
                   params: any[] = [],
                   ID?: string): boolean|string {
    try {
      return this.parallelSubscribe({
        context,
        callback,
        params,
        ID,
      });
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.parallelSubscribe({
          context,
          callback,
          params,
          ID,
        });
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Parallel callback subscribe
   * @param params
   * @return {boolean|string}
   */
  public parallelSubscribe(params: any): boolean|string {
    try {
      const _params: any = this.prepareParams(params);
      if (_params) {
        /**
         * Add method to the stack
         */
        this.parallelStack[_params.ID] = {
          callback: _params.callback,
          context: _params.context,
          params: _params.params,
        };
        /**
         * Return subscription ID
         */
        return _params.ID;
      } else {
        return false;
      }
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.parallelSubscribe(params);
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Serial callback subscribe
   * @param params
   * @return {boolean|string}
   */
  public serialSubscribe(params): boolean|string {
    try {
      const _params: any = this.prepareParams(params);
      if (_params) {
        /**
         * Add method to the stack
         */
        this.serialStack[_params.ID] = {
          callback: _params.callback,
          context: _params.context,
          params: _params.params,
        };
        /**
         * Return subscription ID
         */
        return _params.ID;
      } else {
        return false;
      }
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.serialSubscribe(params);
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Unsubscribe method by ID
   * @param ID
   */
  public unsubscribe(ID: string): boolean {
    try {
      return this.parallelUnsubscribe(ID);
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.parallelUnsubscribe(ID);
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Parallel callback unsubscribe
   * @param ID
   */
  public parallelUnsubscribe(ID: string): boolean {
    try {
      if (typeof ID === "string") {
        /**
         * If required method exist in the stack
         */
        if (this.parallelStack[ID]) {
          /**
           * Nullify method in the stack and destroy it
           */
          this.parallelStack[ID] = false;
          delete this.parallelStack[ID];
          return true;
        }
      }
      return false;
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.parallelUnsubscribe(ID);
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Serial callback unsubscribe method by ID
   * @param ID
   */
  public serialUnsubscribe(ID: string): boolean {
    try {
      if (typeof ID === "string") {
        /**
         * If required method exist in the stack
         */
        if (this.serialStack[ID]) {
          /**
           * Nullify method in the stack and destroy it
           */
          this.serialStack[ID] = false;
          delete this.serialStack[ID];
          return true;
        }
      }
      return false;
    } catch (e) {
      this._errorHandler(e);
      try {
        return root._AnimationFrame.serialUnsubscribe(ID);
      } catch (e) {
        this._errorHandler(e);
        return false;
      }
    }
  }

  /**
   * Generate ID
   */
  public getID(): string {
    return "x-" + (new Date()).getTime() + "-" + Math.round(Math.random() * 1e6);
  }

  /**
   * Prepare subscription params
   * @param _params
   * @return {boolean}
   */
  public prepareParams(_params): boolean|string {
    if (
        typeof _params === "object"
    ) {
      /**
       * Prepare params
       */
      _params.context = _params.context || root;
      _params.callback = _params.callback || (() => {
            return null;
          });
      _params.params = _params.params || [];
      _params.ID = _params.ID || this.getID();
      /**
       * Check params
       */
      if (
          typeof _params.context === "object" &&
          typeof _params.callback === "function" &&
          typeof _params.params === "object" &&
          Array.isArray(_params.params) &&
          typeof _params.ID === "string"
      ) {
        return _params;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Watch and call methods
   */
  public watch(): void {
    try {
      try {
        this.parallelWatch();
      } catch (e) {
        this._errorHandler(e);
      }
      try {
        this.serialWatch();
      } catch (e) {
        this._errorHandler(e);
      }
      /**
       * Recall watcher
       */
      root.requestAnimationFrame(this.watch.bind(this));
    } catch (e) {
      this._errorHandler(e);
    }
  }

  /**
   * Watch and call methods
   */
  public parallelWatch(): void {
    try {
      /**
       * If stack exist, it is an object and it is contains methods
       */
      if (
          this.parallelStack &&
          typeof this.parallelStack === "object" &&
          Object.keys(this.parallelStack).length > 0
      ) {
        /**
         * Loop all methods in stack
         */
        for (const parallelID in this.parallelStack) {
          /**
           * Process only methods without extended properties
           */
          if (this.parallelStack.hasOwnProperty(parallelID)) {
            try {

              /**
               * If ID exist and it is a string
               */
              if (
                  parallelID &&
                  typeof parallelID === "string"
              ) {
                /**
                 * Get subscribed method params by ID
                 */
                const objCall = this.parallelStack[parallelID];
                /**
                 * If params exist, it is an object, and it is contains call context,
                 * callback, and parameters which is array
                 */
                if (
                    objCall &&
                    typeof objCall === "object" &&
                    objCall.context &&
                    objCall.callback &&
                    objCall.params &&
                    typeof objCall.context === "object" &&
                    typeof objCall.callback === "function" &&
                    Array.isArray(objCall.params)
                ) {
                  /**
                   * Call subscribed method
                   */
                  objCall.callback.apply(objCall.context, objCall.params);
                }
              }

            } catch (e) {
              this._errorHandler(e);
            }
          }
        }
      }
    } catch (e) {
      this._errorHandler(e);
    }
  }

  /**
   * Watch and call methods
   */
  public serialWatch(): void {
    try {
      /**
       * If stack exist, it is an object and it is contains methods
       */
      if (
          this.serialStack &&
          typeof this.serialStack === "object"
      ) {
        const keys = Object.keys(this.serialStack);
        if (
            keys &&
            keys.length > 0
        ) {
          if (this.serialID >= keys.length) {
            this.serialID = 0;
          }

          const _serialID = keys[this.serialID];

          this.serialID++;
          /**
           * Process only methods without extended properties
           */
          if (this.serialStack.hasOwnProperty(_serialID)) {
            /**
             * If ID exist and it is a string
             */
            if (
                _serialID &&
                typeof _serialID === "string"
            ) {
              /**
               * Get subscribed method params by ID
               */
              const objCall = this.serialStack[_serialID];
              /**
               * If params exist, it is an object, and it is contains call context,
               * callback, and parameters which is array
               */
              if (
                  objCall &&
                  typeof objCall === "object" &&
                  objCall.context &&
                  objCall.callback &&
                  objCall.params &&
                  typeof objCall.context === "object" &&
                  typeof objCall.callback === "function" &&
                  Array.isArray(objCall.params)
              ) {
                /**
                 * Call subscribed method
                 */
                objCall.callback.apply(objCall.context, objCall.params);
              }
            }
          }
        }
      }
    } catch (e) {
      this._errorHandler(e);
    }
  }

  /**
   * Error Handler
   */
  public _errorHandler(e) {
    if (this.errorHandler) {
      this.errorHandler(e);
    }
  }
}
/**
 * Check version
 */
function version_lt(v1, v2) {
  if (
      typeof v1 === "string" &&
      typeof v2 === "string"
  ) {
    v1 = v1.trim().split(".");
    v2 = v2.trim().split(".");
    for (let i = 0; i < v1.length; i++) {
      v1[i] = v1[i] || 0;
      v2[i] = v2[i] || 0;
      if (v1[i] > v2[i]) {
        return false;
      } else if (v1[i] < v2[i]) {
        return true;
      }
    }
  }
  return false;
}
/**
 * Create single request animation frame object
 * @type {AnimationFrame}
 */
if (
    !root.AnimationFrame || !root.AnimationFrame.version ||
    version_lt(root.AnimationFrame.version, VERSION)
) {
  Object.defineProperty(root, "AnimationFrame", {
    configurable: true,
    enumerable: false,
    get: () => {
      root._AnimationFrame = root._AnimationFrame || new AnimationFrame();
      return root._AnimationFrame;
    },
    set: (v) => {
      if (!root._AnimationFrame) {
        /**
         * root._AnimationFrame was empty and can be set
         */
        root._AnimationFrame = v;
      } else if (
          !root._AnimationFrame.version ||
          version_lt(root._AnimationFrame.version, v.version)
      ) {
        /**
         * Saved old animation frame
         */
        root._oldAnimationFrame = root._AnimationFrame;
        /**
         * Stop old watchers
         */
        root._oldAnimationFrame.parallelWatch = () => {
        };
        root._oldAnimationFrame.serialWatch = () => {
        };
        root._oldAnimationFrame.watch = () => {
        };
        /**
         * Overridable subscription methods
         */
        root._oldAnimationFrame.subscribe = v.subscribe;
        root._oldAnimationFrame.parallelSubscribe = v.parallelSubscribe;
        root._oldAnimationFrame.serialSubscribe = v.serialSubscribe;
        /**
         * Freeze old stacks
         */
        if (root._oldAnimationFrame.parallelStack) {
          Object.preventExtensions(root._oldAnimationFrame.parallelStack);
        }
        if (root._oldAnimationFrame.stack) {
          Object.preventExtensions(root._oldAnimationFrame.stack);
        }
        if (root._oldAnimationFrame.serialStack) {
          Object.preventExtensions(root._oldAnimationFrame.serialStack);
        }
        /**
         * In root._AnimationFrame was previous version and it should migrate
         */
        root._AnimationFrame = v;
        /**
         * Migrate subscriptions
         */
        if (typeof root._oldAnimationFrame.parallelStack === "object") {
          /**
           * Migrate parallel subscriptions
           */
          for (const ID in root._oldAnimationFrame.parallelStack) {
            if (root._oldAnimationFrame.parallelStack.hasOwnProperty(ID)) {
              root._AnimationFrame.parallelSubscribe({
                callback: root._oldAnimationFrame.parallelStack[ID].callback,
                context: root._oldAnimationFrame.parallelStack[ID].context,
                params: root._oldAnimationFrame.parallelStack[ID].params,
                ID,
              });
              root._oldAnimationFrame.parallelUnsubscribe(ID);
              delete root._oldAnimationFrame.parallelStack[ID];
            }
          }
        } else if (typeof root._oldAnimationFrame.stack === "object") {
          /**
           * Migrate serial subscriptions
           */
          for (const ID in root._oldAnimationFrame.stack) {
            if (root._oldAnimationFrame.stack.hasOwnProperty(ID)) {
              root._AnimationFrame.subscribe(
                  root._oldAnimationFrame.stack[ID].context,
                  root._oldAnimationFrame.stack[ID].callback,
                  root._oldAnimationFrame.stack[ID].params,
                  root._oldAnimationFrame.stack[ID].ID,
              );
              root._oldAnimationFrame.unsubscribe(ID);
              delete root._oldAnimationFrame.stack[ID];
            }
          }
        }
        if (typeof root._oldAnimationFrame.serialStack === "object") {
          /**
           * Migrate serial subscriptions
           */
          for (const ID in root._oldAnimationFrame.serialStack) {
            if (root._oldAnimationFrame.serialStack.hasOwnProperty(ID)) {
              root._AnimationFrame.serialSubscribe({
                callback: root._oldAnimationFrame.serialStack[ID].callback,
                context: root._oldAnimationFrame.serialStack[ID].context,
                params: root._oldAnimationFrame.serialStack[ID].params,
                ID,
              });
              root._oldAnimationFrame.serialUnsubscribe(ID);
              delete root._oldAnimationFrame.serialStack[ID];
            }
          }
        }
      }
    },
  });
}
/**
 * Export single AnimationFrame instance
 */
root.AnimationFrame = new AnimationFrame();

const _AnimationFrame: IAnimationFrame = root.AnimationFrame;
export default _AnimationFrame;
module.exports = _AnimationFrame;
