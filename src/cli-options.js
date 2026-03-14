function hasOwn(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
}

function normalizeOptionName(name) {
  return String(name).replace(/^--/, "");
}

function toSnakeCase(name) {
  return normalizeOptionName(name).replace(/-/g, "_");
}

function toKebabCase(name) {
  return normalizeOptionName(name).replace(/_/g, "-");
}

function optionKeyCandidates(name) {
  const normalized = normalizeOptionName(name);
  return [...new Set([normalized, toKebabCase(normalized), toSnakeCase(normalized)])];
}

function hasFlag(args, ...flags) {
  return flags.some((flag) => args.includes(flag));
}

function parseOptions(args) {
  const parsed = {};
  const positional = [];

  for (let index = 0; index < args.length; index += 1) {
    const token = args[index];

    if (!token.startsWith("--")) {
      positional.push(token);
      continue;
    }

    const [rawKey, ...rest] = token.slice(2).split("=");
    const inlineValue = rest.length > 0 ? rest.join("=") : null;

    if (inlineValue !== null) {
      parsed[rawKey] = inlineValue;
      continue;
    }

    const next = args[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[rawKey] = next;
      index += 1;
      continue;
    }

    parsed[rawKey] = true;
  }

  return { parsed, positional };
}

function readOption(parsedOptions, name) {
  for (const candidate of optionKeyCandidates(name)) {
    if (hasOwn(parsedOptions, candidate)) {
      return parsedOptions[candidate];
    }
  }

  return undefined;
}

function readStringOption(parsedOptions, name) {
  const value = readOption(parsedOptions, name);
  if (value === undefined) {
    return undefined;
  }

  if (value === true) {
    throw new Error(`\`--${toKebabCase(name)}\` requires a value.`);
  }

  return String(value);
}

function parseBooleanValue(value, name) {
  if (value === true || value === false) {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (normalized === "true") {
      return true;
    }
    if (normalized === "false") {
      return false;
    }
  }

  throw new Error(`\`--${toKebabCase(name)}\` must be \`true\` or \`false\`.`);
}

function readBooleanOption(parsedOptions, name) {
  const value = readOption(parsedOptions, name);
  if (value === undefined) {
    return undefined;
  }

  return parseBooleanValue(value, name);
}

function readFlagOption(parsedOptions, name) {
  const value = readBooleanOption(parsedOptions, name);
  return value === undefined ? false : value;
}

function validateIsoDate(value, name) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`\`--${toKebabCase(name)}\` must be an ISO date like \`2026-03-13\`.`);
  }

  const isoValue = `${match[1]}-${match[2]}-${match[3]}`;
  const parsed = new Date(`${isoValue}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== isoValue) {
    throw new Error(`\`--${toKebabCase(name)}\` must be an ISO date like \`2026-03-13\`.`);
  }

  return value;
}

function validateIsoDateTime(value, name) {
  const isoDateTime =
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;
  if (!isoDateTime.test(value) || Number.isNaN(Date.parse(value))) {
    throw new Error(
      `\`--${toKebabCase(name)}\` must be an ISO datetime like \`2026-03-13T15:00:00Z\`.`
    );
  }

  return value;
}

function readIsoDateOption(parsedOptions, name) {
  const value = readStringOption(parsedOptions, name);
  if (value === undefined) {
    return undefined;
  }

  return validateIsoDate(value, name);
}

function readIsoDateTimeOption(parsedOptions, name) {
  const value = readStringOption(parsedOptions, name);
  if (value === undefined) {
    return undefined;
  }

  return validateIsoDateTime(value, name);
}

function readCommandOptions(parsedOptions, schema, positional = [], baseOptions = {}, fixed = {}) {
  const options = { ...baseOptions };

  Object.entries(schema || {}).forEach(([propertyName, optionDef]) => {
    if (optionDef.positional !== undefined) {
      options[propertyName] = positional[optionDef.positional];
      return;
    }

    switch (optionDef.kind) {
      case "boolean":
        options[propertyName] = readBooleanOption(parsedOptions, optionDef.option);
        return;
      case "flag":
        options[propertyName] = readFlagOption(parsedOptions, optionDef.option);
        return;
      case "iso-date":
        options[propertyName] = readIsoDateOption(parsedOptions, optionDef.option);
        return;
      case "iso-datetime":
        options[propertyName] = readIsoDateTimeOption(parsedOptions, optionDef.option);
        return;
      case "string":
      default:
        options[propertyName] = readStringOption(parsedOptions, optionDef.option);
    }
  });

  return {
    ...options,
    ...fixed,
  };
}

module.exports = {
  hasFlag,
  parseOptions,
  readBooleanOption,
  readCommandOptions,
  readFlagOption,
  readIsoDateOption,
  readIsoDateTimeOption,
  readOption,
  readStringOption,
  toKebabCase,
};
