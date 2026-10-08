import assert from "node:assert/strict";
import { PassThrough } from "node:stream";
import test from "node:test";
import { promptRecordLimit } from "./main.js";

test("record prompt accepts a count, accepts blank for all, and retries invalid answers", async () => {
  for (const [answers, expected] of [
    [["50"], 50],
    [[""], undefined],
    [["bad", "0", "2.5", "3"], 3],
  ]) {
    const input = new PassThrough();
    const output = new PassThrough();
    let text = "";
    output.on("data", (chunk) => {
      text += chunk;
      if (chunk.toString().includes("How many records")) {
        const answer = answers.shift();
        setImmediate(() => input.write(`${answer}\n`));
      }
    });
    try {
      assert.equal(await promptRecordLimit(100, { input, output }), expected);
      assert.match(text, /100 remaining; blank = all/);
      if (expected === 3) assert.match(text, /positive whole number/);
    } finally {
      input.destroy();
      output.destroy();
    }
  }
});

test("closing input or cancelling the prompt stops before generation", async () => {
  for (const cancel of [false, true]) {
    const input = new PassThrough();
    const output = new PassThrough();
    const controller = new AbortController();
    output.on("data", () => setImmediate(() => (cancel ? controller.abort() : input.end())));
    try {
      await assert.rejects(
        promptRecordLimit(100, { input, output, signal: controller.signal }),
        cancel ? /aborted/ : /Input closed/,
      );
    } finally {
      input.destroy();
      output.destroy();
    }
  }
});
