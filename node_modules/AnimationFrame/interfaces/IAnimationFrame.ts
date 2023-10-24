"use strict";
/**
 * The IAnimationFrame interface
 */
interface IAnimationFrame {
  /**
   * Current version
   */
  version: string;

  /**
   * Stacks
   */
  parallelStack: any;
  serialStack: any;
  stack: any;

  /**
   * Error handler method
   */
  errorHandler: any;

  /**
   * Serial iteration ID
   */
  serialID: number;

  /**
   * Subscribe method to watch
   * @param context
   * @param callback
   * @param params
   * @param ID
   * @return {boolean|string}
   */
  subscribe(context?: any,
            callback?: Function,
            params?: Array<any>,
            ID?: string): boolean|string;

  /**
   * Parallel callback subscribe
   * @param params
   * @return {boolean|string}
   */
  parallelSubscribe(params: any): boolean|string;

  /**
   * Serial callback subscribe
   * @param params
   * @return {boolean|string}
   */
  serialSubscribe(params: any): boolean|string;

  /**
   * Unsubscribe method by ID
   * @param ID
   */
  unsubscribe(ID: string): boolean;

  /**
   * Parallel callback unsubscribe
   * @param ID
   */
  parallelUnsubscribe(ID: string): boolean;

  /**
   * Serial callback unsubscribe method by ID
   * @param ID
   */
  serialUnsubscribe(ID: string): boolean;

  /**
   * Generate ID
   */
  getID(): string;

  /**
   * Prepare subscription params
   * @param _params
   * @return {boolean}
   */
  prepareParams(_params: any): boolean|string;

  /**
   * Watch and call methods
   */
  watch(): void;

  /**
   * Watch and call methods
   */
  parallelWatch(): void;

  /**
   * Watch and call methods
   */
  serialWatch(): void;

  /**
   * Error Handler
   */
  _errorHandler(e): void;
}
/**
 * Export the IAnimationFrame interface
 */
export default IAnimationFrame;
