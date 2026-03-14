const { fetchResourceById } = require("./clio-api");
const {
  clip,
  compactQuery,
  parseLimit,
  printKeyValueRows,
} = require("./resource-utils");
const {
  createGetCommand,
  createListCommand,
  fetchDefaultListResult,
} = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const MATTER_RESOURCE = getResourceMetadata("matters");
const PRACTICE_AREA_RESOURCE = getResourceMetadata("practice-areas");
const MATTER_LOOKUP_FIELDS = "id,practice_area{id}";

function buildPracticeAreaQuery(options) {
  return compactQuery({
    code: options.code || undefined,
    created_since: options.createdSince || undefined,
    fields: options.fields || PRACTICE_AREA_RESOURCE.defaultFields.list,
    limit: parseLimit(options.limit),
    name: options.name || undefined,
    order: options.order || undefined,
    page_token: options.pageToken || undefined,
    updated_since: options.updatedSince || undefined,
  });
}

function matchesTimestampOnOrAfter(value, threshold) {
  if (!threshold) {
    return true;
  }

  const valueTime = Date.parse(value);
  const thresholdTime = Date.parse(threshold);

  if (Number.isNaN(valueTime) || Number.isNaN(thresholdTime)) {
    return true;
  }

  return valueTime >= thresholdTime;
}

function practiceAreaMatchesOptions(practiceArea, options = {}) {
  const code = String(practiceArea?.code || "");
  const name = String(practiceArea?.name || "");

  if (options.code && code.toLowerCase() !== String(options.code).toLowerCase()) {
    return false;
  }

  if (
    options.name &&
    !name.toLowerCase().includes(String(options.name).trim().toLowerCase())
  ) {
    return false;
  }

  if (!matchesTimestampOnOrAfter(practiceArea?.created_at, options.createdSince)) {
    return false;
  }

  if (!matchesTimestampOnOrAfter(practiceArea?.updated_at, options.updatedSince)) {
    return false;
  }

  return true;
}

function buildSinglePageResult(data) {
  return {
    data,
    firstPage: {
      data,
      meta: {
        paging: {},
        records: data.length,
      },
    },
    nextPageUrl: null,
    pagesFetched: 1,
  };
}

async function practiceAreasListForMatter(config, accessToken, options = {}) {
  const matterPayload = await fetchResourceById(
    config,
    accessToken,
    MATTER_RESOURCE.apiPath,
    options.matterId,
    {
      fields: MATTER_LOOKUP_FIELDS,
    }
  );
  const practiceAreaId = matterPayload?.data?.practice_area?.id;

  if (!practiceAreaId) {
    return buildSinglePageResult([]);
  }

  const payload = await fetchResourceById(
    config,
    accessToken,
    PRACTICE_AREA_RESOURCE.apiPath,
    practiceAreaId,
    {
      fields: options.fields || PRACTICE_AREA_RESOURCE.defaultFields.get,
    }
  );
  const practiceArea = payload?.data;
  const data =
    practiceArea && practiceAreaMatchesOptions(practiceArea, options)
      ? [practiceArea]
      : [];

  return buildSinglePageResult(data);
}

function formatPracticeAreaRow(practiceArea) {
  return {
    category: String(practiceArea.category || "-"),
    code: String(practiceArea.code || "-"),
    id: String(practiceArea.id || "-"),
    name: String(practiceArea.name || "-"),
  };
}

function printPracticeAreaList(rows, options) {
  if (rows.length === 0) {
    console.log("No practice areas found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       CODE         NAME                         CATEGORY");
  console.log("-------- ------------ ---------------------------- ------------------------------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.code, 12).padEnd(12, " "),
      clip(row.name, 28).padEnd(28, " "),
      clip(row.category, 30),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(
      `Showing ${visibleRows.length} of ${rows.length} practice areas. Use --json for full output.`
    );
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printPracticeArea(practiceArea) {
  printKeyValueRows([
    ["ID", practiceArea.id],
    ["Code", practiceArea.code],
    ["Name", practiceArea.name],
    ["Category", practiceArea.category],
    ["Created", practiceArea.created_at],
    ["Updated", practiceArea.updated_at],
  ]);
}

async function fetchPracticeAreaListResult({ accessToken, apiPath, config, options, query }) {
  if (options.matterId) {
    return practiceAreasListForMatter(config, accessToken, options);
  }

  return fetchDefaultListResult({
    accessToken,
    apiPath,
    config,
    options,
    query,
  });
}

const practiceAreasList = createListCommand({
  apiPath: PRACTICE_AREA_RESOURCE.apiPath,
  buildQuery: buildPracticeAreaQuery,
  fetchListResult: fetchPracticeAreaListResult,
  formatRow: formatPracticeAreaRow,
  pluralLabel: PRACTICE_AREA_RESOURCE.summaryLabels.plural,
  printList: printPracticeAreaList,
  redactionResourceType: PRACTICE_AREA_RESOURCE.redaction.resourceType,
  singularLabel: PRACTICE_AREA_RESOURCE.summaryLabels.singular,
});

const practiceAreasGet = createGetCommand({
  apiPath: PRACTICE_AREA_RESOURCE.apiPath,
  defaultFields: PRACTICE_AREA_RESOURCE.defaultFields.get,
  printItem: printPracticeArea,
  redactionResourceType: PRACTICE_AREA_RESOURCE.redaction.resourceType,
  usage: "Usage: not-manage practice-areas get <id> [--fields ...] [--json]",
});

module.exports = {
  practiceAreasGet,
  practiceAreasList,
  __private: {
    buildPracticeAreaQuery,
    buildSinglePageResult,
    formatPracticeAreaRow,
    practiceAreaMatchesOptions,
    practiceAreasListForMatter,
    printPracticeArea,
    printPracticeAreaList,
  },
};
