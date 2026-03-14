const { fetchResourceById, fetchResourcePage } = require("./clio-api");
const {
  clip,
  compactQuery,
  fetchPages,
  formatBoolean,
  formatMoney,
  parseLimit,
  printKeyValueRows,
  readMatterLabel,
  readUserName,
} = require("./resource-utils");
const {
  buildSummaryMessage,
  createGetCommand,
  createListCommand,
  fetchDefaultListResult,
} = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const ACTIVITY_RESOURCE = getResourceMetadata("activities");
const MATTER_RESOURCE = getResourceMetadata("matters");

function readHours(activity) {
  const quantityInHours = Number(activity?.quantity_in_hours);
  if (Number.isFinite(quantityInHours)) {
    return quantityInHours.toFixed(2);
  }

  const quantity = Number(activity?.quantity);
  if (Number.isFinite(quantity)) {
    return (quantity / 3600).toFixed(2);
  }

  return "-";
}

function buildActivityQuery(options) {
  return compactQuery({
    activity_description_id: options.activityDescriptionId || undefined,
    created_since: options.createdSince || undefined,
    end_date: options.endDate || undefined,
    fields: options.fields || ACTIVITY_RESOURCE.defaultFields.list,
    flat_rate:
      options.flatRate === undefined || options.flatRate === null
        ? undefined
        : Boolean(options.flatRate),
    limit: parseLimit(options.limit),
    matter_id: options.matterId || undefined,
    only_unaccounted_for: options.onlyUnaccountedFor ? true : undefined,
    order: options.order || undefined,
    page_token: options.pageToken || undefined,
    query: options.query || undefined,
    start_date: options.startDate || undefined,
    status: options.status || undefined,
    task_id: options.taskId || undefined,
    type: options.type || undefined,
    updated_since: options.updatedSince || undefined,
    user_id: options.userId || undefined,
  });
}

function formatActivityRow(activity) {
  return {
    billed: formatBoolean(activity.billed),
    date: String(activity.date || "-"),
    hours: readHours(activity),
    id: String(activity.id || "-"),
    matter: readMatterLabel(activity.matter),
    note: String(activity.note || "-"),
    total: formatMoney(activity.total),
    type: String(activity.type || "-"),
  };
}

function printActivityList(rows, options) {
  if (rows.length === 0) {
    console.log("No activities found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       TYPE        DATE       HOURS TOTAL      BILLED MATTER               NOTE");
  console.log("-------- ----------- ---------- ----- ---------- ------ -------------------- ------------------------------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.type, 11).padEnd(11, " "),
      clip(row.date, 10).padEnd(10, " "),
      clip(row.hours, 5).padEnd(5, " "),
      clip(row.total, 10).padEnd(10, " "),
      clip(row.billed, 6).padEnd(6, " "),
      clip(row.matter, 20).padEnd(20, " "),
      clip(row.note, 30),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} activities. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    if (options.pageTokenSupported === false) {
      console.log("Run again with `--all` to fetch every matching activity.");
      return;
    }
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printActivity(activity) {
  printKeyValueRows([
    ["ID", activity.id],
    ["Type", activity.type],
    ["Date", activity.date],
    ["Hours", readHours(activity)],
    ["Price", formatMoney(activity.price)],
    ["Total", formatMoney(activity.total)],
    ["Billed", formatBoolean(activity.billed)],
    ["On Bill", formatBoolean(activity.on_bill)],
    ["Non-Billable", formatBoolean(activity.non_billable)],
    ["No Charge", formatBoolean(activity.no_charge)],
    ["Flat Rate", formatBoolean(activity.flat_rate)],
    ["Contingency Fee", formatBoolean(activity.contingency_fee)],
    ["User", readUserName(activity.user)],
    ["Matter", readMatterLabel(activity.matter)],
    ["Activity Description", activity.activity_description?.name],
    ["Bill", activity.bill?.number],
    ["Bill State", activity.bill?.state],
    ["Reference", activity.reference],
    ["Note", activity.note],
    ["Created", activity.created_at],
    ["Updated", activity.updated_at],
  ]);
}

async function fetchMatterIdsForClient(config, accessToken, clientId) {
  const matterQuery = {
    client_id: clientId,
    fields: "id",
    limit: 200,
  };
  const result = await fetchPages(
    (pageQuery, nextPageUrl) =>
      fetchResourcePage(config, accessToken, MATTER_RESOURCE.apiPath, pageQuery, nextPageUrl),
    matterQuery,
    true
  );

  const matterIds = result.data
    .map((matter) => matter?.id)
    .filter((id) => id !== undefined && id !== null && id !== "");

  return {
    matterIds,
    pagesFetched: result.pagesFetched,
  };
}

async function fetchActivitiesForClient(config, accessToken, query, options) {
  if (query.page_token) {
    throw new Error(
      "`--page-token` is not supported with `activities list --client-id`. Use `--all` or filter by `--matter-id`."
    );
  }

  const { matterIds, pagesFetched: matterPagesFetched } = await fetchMatterIdsForClient(
    config,
    accessToken,
    options.clientId
  );

  if (matterIds.length === 0) {
    return {
      activityPagesFetched: 0,
      data: [],
      matterCount: 0,
      matterLookupPagesFetched: matterPagesFetched,
      moreResultsAvailable: false,
    };
  }

  const aggregateLimit = query.limit || 200;
  let remaining = options.all ? Number.POSITIVE_INFINITY : aggregateLimit;
  let activityPagesFetched = 0;
  const data = [];
  let moreResultsAvailable = false;

  for (let index = 0; index < matterIds.length; index += 1) {
    const matterId = matterIds[index];

    if (!options.all && remaining <= 0) {
      moreResultsAvailable = true;
      break;
    }

    const matterQuery = compactQuery({
      ...query,
      limit: options.all ? query.limit : Math.min(remaining, 200),
      matter_id: matterId,
      page_token: undefined,
    });
    const result = await fetchPages(
      (pageQuery, nextPageUrl) =>
        fetchResourcePage(config, accessToken, ACTIVITY_RESOURCE.apiPath, pageQuery, nextPageUrl),
      matterQuery,
      Boolean(options.all)
    );

    data.push(...result.data);
    activityPagesFetched += result.pagesFetched;

    if (!options.all) {
      remaining -= result.data.length;
      if (result.nextPageUrl || (remaining <= 0 && index < matterIds.length - 1)) {
        moreResultsAvailable = true;
      }
    }
  }

  return {
    activityPagesFetched,
    data,
    matterCount: matterIds.length,
    matterLookupPagesFetched: matterPagesFetched,
    moreResultsAvailable,
  };
}

async function fetchActivityListResult({ accessToken, apiPath, config, options, query }) {
  if (options.clientId && !options.matterId) {
    const clientResult = await fetchActivitiesForClient(config, accessToken, query, options);
    return {
      data: clientResult.data,
      extraMeta: {
        activity_pages_fetched: clientResult.activityPagesFetched,
        client_id: options.clientId,
        matter_count: clientResult.matterCount,
        matter_pages_fetched: clientResult.matterLookupPagesFetched,
        more_results_available: clientResult.moreResultsAvailable,
      },
      firstPage: {
        data: clientResult.data,
        meta: {
          paging: {
            next: clientResult.moreResultsAvailable ? "client-derived" : null,
          },
        },
      },
      nextPageUrl: clientResult.moreResultsAvailable ? "client-derived" : null,
      pageTokenSupported: false,
      pagesFetched: clientResult.activityPagesFetched,
      summaryMode: "client-derived",
    };
  }

  return {
    ...(await fetchDefaultListResult({
      accessToken,
      apiPath,
      config,
      options,
      query,
    })),
    pageTokenSupported: true,
    summaryMode: "default",
  };
}

function buildActivityJsonMeta({ result }) {
  return result.extraMeta || {};
}

function buildActivityListPrintOptions({ options, result }) {
  return {
    all: Boolean(options.all),
    nextPageUrl: result.nextPageUrl,
    pageTokenSupported: result.pageTokenSupported,
  };
}

function printActivitySummary({ result, rows }) {
  if (result.summaryMode === "client-derived") {
    console.log(
      `Returned ${rows.length} activit${rows.length === 1 ? "y" : "ies"} across ${result.pagesFetched} activity page${result.pagesFetched === 1 ? "" : "s"} for ${result.extraMeta.matter_count} matter${result.extraMeta.matter_count === 1 ? "" : "s"}.`
    );
    return;
  }

  console.log(
    buildSummaryMessage(
      rows.length,
      result.pagesFetched,
      ACTIVITY_RESOURCE.summaryLabels.singular,
      ACTIVITY_RESOURCE.summaryLabels.plural
    )
  );
}

const activitiesList = createListCommand({
  apiPath: ACTIVITY_RESOURCE.apiPath,
  buildJsonMeta: buildActivityJsonMeta,
  buildListPrintOptions: buildActivityListPrintOptions,
  buildQuery: buildActivityQuery,
  fetchListResult: fetchActivityListResult,
  formatRow: formatActivityRow,
  pluralLabel: ACTIVITY_RESOURCE.summaryLabels.plural,
  printList: printActivityList,
  printSummary: printActivitySummary,
  redactionResourceType: ACTIVITY_RESOURCE.redaction.resourceType,
  singularLabel: ACTIVITY_RESOURCE.summaryLabels.singular,
});

const activitiesGet = createGetCommand({
  apiPath: ACTIVITY_RESOURCE.apiPath,
  defaultFields: ACTIVITY_RESOURCE.defaultFields.get,
  printItem: printActivity,
  redactionResourceType: ACTIVITY_RESOURCE.redaction.resourceType,
  usage: "Usage: not-manage activities get <id> [--fields ...] [--json]",
});

module.exports = {
  activitiesGet,
  activitiesList,
  __private: {
    buildActivityQuery,
    fetchActivitiesForClient,
    fetchMatterIdsForClient,
    formatActivityRow,
    printActivity,
    printActivityList,
    readHours,
  },
};
