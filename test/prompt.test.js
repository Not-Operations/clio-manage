const test = require("node:test");
const assert = require("node:assert/strict");
const { Writable } = require("node:stream");

const { PromptOutput, decodePromptChunk } = require("../src/prompt");

test("decodePromptChunk treats buffer encodings as plain text", () => {
  assert.equal(decodePromptChunk(Buffer.from("secret"), "buffer"), "secret");
  assert.equal(decodePromptChunk(Buffer.from("secret"), undefined), "secret");
});

test("PromptOutput does not crash when muted input arrives as a buffer chunk", async () => {
  const writes = [];
  const target = new Writable({
    write(chunk, encoding, callback) {
      writes.push({ chunk: chunk.toString(), encoding });
      callback();
    },
  });

  const output = new PromptOutput(target);
  output.muted = true;

  await new Promise((resolve, reject) => {
    output._write(Buffer.from("secret"), "buffer", (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  assert.deepStrictEqual(writes, []);
});

test("PromptOutput still forwards muted newlines", async () => {
  const writes = [];
  const target = new Writable({
    write(chunk, encoding, callback) {
      writes.push({ chunk: chunk.toString(), encoding });
      callback();
    },
  });

  const output = new PromptOutput(target);
  output.muted = true;

  await new Promise((resolve, reject) => {
    output._write(Buffer.from("\n"), "buffer", (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });

  assert.deepStrictEqual(writes, [{ chunk: "\n", encoding: "buffer" }]);
});
