"use strict";

let fs = require("fs");

let _package = require("../package.json");

_package = {
  name: _package.name,
  version: _package.version
};

fs.writeFileSync("./package.ts", `
const PACKAGE = ${JSON.stringify(_package)};
export default PACKAGE;
module.exports = PACKAGE;
`);
