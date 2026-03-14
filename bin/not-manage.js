#!/usr/bin/env node

const { run } = require("../src/cli");

run(process.argv.slice(2)).catch((_error) => {
  console.error("Error: command failed.");
  process.exit(1);
});
