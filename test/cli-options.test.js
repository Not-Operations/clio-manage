const test = require("node:test");
const assert = require("node:assert/strict");

const {
  parseOptions,
  readBooleanOption,
  readCommandOptions,
  readIsoDateOption,
  readIsoDateTimeOption,
  readOption,
  readStringOption,
} = require("../src/cli-options");

test("readOption accepts both kebab-case and snake_case flag names", () => {
  const { parsed } = parseOptions([
    "--client-id",
    "101",
    "--page_token",
    "cursor-1",
  ]);

  assert.equal(readOption(parsed, "client-id"), "101");
  assert.equal(readOption(parsed, "client_id"), "101");
  assert.equal(readOption(parsed, "page-token"), "cursor-1");
  assert.equal(readOption(parsed, "page_token"), "cursor-1");
});

test("readBooleanOption preserves explicit false values", () => {
  const { parsed } = parseOptions([
    "--enabled",
    "false",
    "--include-co-counsel",
  ]);

  assert.equal(readBooleanOption(parsed, "enabled"), false);
  assert.equal(readBooleanOption(parsed, "include_co_counsel"), true);
});

test("date readers validate ISO date and datetime inputs", () => {
  const { parsed } = parseOptions([
    "--start-date",
    "2026-03-13",
    "--updated-since",
    "2026-03-13T17:45:00Z",
  ]);

  assert.equal(readIsoDateOption(parsed, "start-date"), "2026-03-13");
  assert.equal(
    readIsoDateTimeOption(parsed, "updated_since"),
    "2026-03-13T17:45:00Z"
  );

  assert.throws(
    () => readIsoDateOption({ "start-date": "03/13/2026" }, "start-date"),
    /ISO date/
  );
  assert.throws(
    () => readIsoDateTimeOption({ updated_since: "2026-03-13 17:45:00" }, "updated-since"),
    /ISO datetime/
  );
});

test("readCommandOptions applies schema coercion, positional ids, and fixed overrides", () => {
  const { parsed, positional } = parseOptions([
    "123",
    "--complete",
    "false",
    "--due_at_from",
    "2026-03-01",
  ]);

  const options = readCommandOptions(
    parsed,
    {
      complete: { kind: "boolean", option: "complete" },
      dueAtFrom: { kind: "iso-date", option: "due-at-from" },
      id: { positional: 0 },
      type: { kind: "string", option: "type" },
    },
    positional,
    { json: true },
    { type: "TimeEntry" }
  );

  assert.deepStrictEqual(options, {
    complete: false,
    dueAtFrom: "2026-03-01",
    id: "123",
    json: true,
    type: "TimeEntry",
  });
});

test("readStringOption rejects bare value-less flags for required string options", () => {
  assert.throws(
    () => readStringOption({ query: true }, "query"),
    /requires a value/
  );
});
