const {
  clip,
  compactQuery,
  formatMoney,
  parseLimit,
  printKeyValueRows,
} = require("./resource-utils");
const { createListCommand } = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const BILLABLE_CLIENT_RESOURCE = getResourceMetadata("billable-clients");

function buildBillableClientQuery(options) {
  return compactQuery({
    client_id: options.clientId || undefined,
    end_date: options.endDate || undefined,
    fields: options.fields || BILLABLE_CLIENT_RESOURCE.defaultFields.list,
    limit: parseLimit(options.limit, 25),
    matter_id: options.matterId || undefined,
    originating_attorney_id: options.originatingAttorneyId || undefined,
    page_token: options.pageToken || undefined,
    query: options.query || undefined,
    responsible_attorney_id: options.responsibleAttorneyId || undefined,
    start_date: options.startDate || undefined,
  });
}

function formatBillableClientRow(record) {
  return {
    amount: formatMoney(record.unbilled_amount),
    hours:
      record.unbilled_hours === undefined || record.unbilled_hours === null
        ? "-"
        : Number(record.unbilled_hours).toFixed(2),
    id: String(record.id || "-"),
    matters: String(record.billable_matters_count ?? "-"),
    name: String(record.name || "-"),
    trust: formatMoney(record.amount_in_trust),
  };
}

function printBillableClientList(rows, options) {
  if (rows.length === 0) {
    console.log("No billable clients found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       NAME                         HOURS AMOUNT     TRUST      MATTERS");
  console.log("-------- ---------------------------- ----- ---------- ---------- -------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.name, 28).padEnd(28, " "),
      clip(row.hours, 5).padEnd(5, " "),
      clip(row.amount, 10).padEnd(10, " "),
      clip(row.trust, 10).padEnd(10, " "),
      clip(row.matters, 7),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} billable clients. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printBillableClient(record) {
  printKeyValueRows([
    ["ID", record.id],
    ["Name", record.name],
    ["Unbilled Hours", record.unbilled_hours],
    ["Unbilled Amount", formatMoney(record.unbilled_amount)],
    ["Amount In Trust", formatMoney(record.amount_in_trust)],
    ["Billable Matters", record.billable_matters_count],
  ]);
}

const billableClientsList = createListCommand({
  apiPath: BILLABLE_CLIENT_RESOURCE.apiPath,
  buildQuery: buildBillableClientQuery,
  formatRow: formatBillableClientRow,
  pluralLabel: BILLABLE_CLIENT_RESOURCE.summaryLabels.plural,
  printList: printBillableClientList,
  redactionResourceType: BILLABLE_CLIENT_RESOURCE.redaction.resourceType,
  singularLabel: BILLABLE_CLIENT_RESOURCE.summaryLabels.singular,
});

module.exports = {
  billableClientsList,
  __private: {
    buildBillableClientQuery,
    formatBillableClientRow,
    printBillableClient,
    printBillableClientList,
  },
};
