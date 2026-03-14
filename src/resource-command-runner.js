const {
  fetchResourceById,
  fetchResourcePage,
  getValidAccessToken,
} = require("./clio-api");
const { fetchPages } = require("./resource-utils");
const { maybeRedactData, maybeRedactPayload } = require("./redaction");
const { getConfig, getTokenSet } = require("./store");

async function getAuthContext() {
  const config = await getConfig();
  const tokenSet = await getTokenSet();
  const accessToken = await getValidAccessToken(config, tokenSet);
  return { accessToken, config };
}

function buildListJsonEnvelope(result, data, extraMeta = {}) {
  return {
    data,
    meta: {
      next_page_url: result.nextPageUrl || null,
      pages_fetched: result.pagesFetched,
      returned_count: data.length,
      ...extraMeta,
    },
  };
}

function buildSummaryMessage(count, pagesFetched, singularLabel, pluralLabel) {
  const label = count === 1 ? singularLabel : pluralLabel;
  return `Returned ${count} ${label} across ${pagesFetched} page${pagesFetched === 1 ? "" : "s"}.`;
}

async function fetchDefaultListResult({ accessToken, apiPath, config, options, query }) {
  return fetchPages(
    (pageQuery, nextPageUrl) =>
      fetchResourcePage(config, accessToken, apiPath, pageQuery, nextPageUrl),
    query,
    Boolean(options.all)
  );
}

async function fetchDefaultItemPayload({ accessToken, apiPath, config, id, query }) {
  return fetchResourceById(config, accessToken, apiPath, id, query);
}

function createListCommand(commandConfig) {
  const {
    apiPath,
    buildJsonMeta,
    buildListPrintOptions,
    buildQuery,
    fetchListResult = fetchDefaultListResult,
    formatRow,
    pluralLabel,
    printList,
    printSummary,
    redactionResourceType,
    singularLabel,
  } = commandConfig;

  return async function listCommand(options = {}) {
    const query = buildQuery(options);
    const { accessToken, config } = await getAuthContext();
    const result = await fetchListResult({
      accessToken,
      apiPath,
      config,
      options,
      query,
    });
    const data = maybeRedactData(result.data, options, redactionResourceType);

    if (options.json) {
      const jsonMeta = buildJsonMeta ? buildJsonMeta({ data, options, result }) : {};
      console.log(JSON.stringify(buildListJsonEnvelope(result, data, jsonMeta), null, 2));
      return;
    }

    const rows = data.map(formatRow);
    const printOptions = buildListPrintOptions
      ? buildListPrintOptions({ options, result })
      : { all: Boolean(options.all), nextPageUrl: result.nextPageUrl };

    printList(rows, printOptions);
    console.log("");

    if (printSummary) {
      printSummary({ options, result, rows });
      return;
    }

    console.log(buildSummaryMessage(rows.length, result.pagesFetched, singularLabel, pluralLabel));
  };
}

function createGetCommand(commandConfig) {
  const {
    apiPath,
    defaultFields,
    fetchItemPayload = fetchDefaultItemPayload,
    printItem,
    redactionResourceType,
    usage,
  } = commandConfig;

  return async function getCommand(options = {}) {
    if (!options.id) {
      throw new Error(usage);
    }

    const { accessToken, config } = await getAuthContext();
    const payload = await fetchItemPayload({
      accessToken,
      apiPath,
      config,
      id: options.id,
      options,
      query: {
        fields: options.fields || defaultFields,
      },
    });
    const redactedPayload = maybeRedactPayload(payload, options, redactionResourceType);

    if (options.json) {
      console.log(JSON.stringify(redactedPayload, null, 2));
      return;
    }

    printItem(redactedPayload?.data || {});
  };
}

module.exports = {
  buildListJsonEnvelope,
  buildSummaryMessage,
  createGetCommand,
  createListCommand,
  fetchDefaultItemPayload,
  fetchDefaultListResult,
  getAuthContext,
};
