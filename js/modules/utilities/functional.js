/**
 * Copyright (c) 2018-present, Livemaster, LLC.
 *
 * @module @lm/modules/BlockToggle
 * @fileOverview набор метод для упрошения взаимодействия в функциональном стиле
 *
 * @author Ilya Reshetnikov <ireshetnikov@livemaster.ru>
 * @version 0.0.1
 */

/**
 * Compose functions right to left
 *
 *
 * @example
 * compose(minus8, add10, multiply10)(4) === 42
 *
 * @param {...[Function]} fns - список функций в виде аргументов.
 * @returns {(function(...[Function]): any)}
 */
export const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)));
