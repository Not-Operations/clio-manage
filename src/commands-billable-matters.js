const {
  clip,
  compactQuery,
  formatMoney,
  parseLimit,
  printKeyValueRows,
  readContactName,
} = require("./resource-utils");
const { createListCommand } = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const BILLABLE_MATTER_RESOURCE = getResourceMetadata("billable-matters");

function buildBillableMatterQuery(options) {
  return compactQuery({
    client_id: options.clientId || undefined,
    end_date: options.endDate || undefined,
    fields: options.fields || BILLABLE_MATTER_RESOURCE.defaultFields.list,
    limit: parseLimit(options.limit, 1000),
    matter_id: options.matterId || undefined,
    originating_attorney_id: options.originatingAttorneyId || undefined,
    page_token: options.pageToken || undefined,
    query: options.query || undefined,
    responsible_attorney_id: options.responsibleAttorneyId || undefined,
    start_date: options.startDate || undefined,
  });
}

function formatBillableMatterRow(record) {
  return {
    amount: formatMoney(record.unbilled_amount),
    client: readContactName(record.client),
    hours:
      record.unbilled_hours === undefined || record.unbilled_hours === null
        ? "-"
        : Number(record.unbilled_hours).toFixed(2),
    id: String(record.id || "-"),
    matter: String(record.display_number || "-"),
    trust: formatMoney(record.amount_in_trust),
  };
}

function printBillableMatterList(rows, options) {
  if (rows.length === 0) {
    console.log("No billable matters found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       MATTER                CLIENT               HOURS AMOUNT     TRUST");
  console.log("-------- --------------------- -------------------- ----- ---------- ----------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.matter, 21).padEnd(21, " "),
      clip(row.client, 20).padEnd(20, " "),
      clip(row.hours, 5).padEnd(5, " "),
      clip(row.amount, 10).padEnd(10, " "),
      clip(row.trust, 10),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} billable matters. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printBillableMatter(record) {
  printKeyValueRows([
    ["ID", record.id],
    ["Matter", record.display_number],
    ["Client", readContactName(record.client)],
    ["Unbilled Hours", record.unbilled_hours],
    ["Unbilled Amount", formatMoney(record.unbilled_amount)],
    ["Amount In Trust", formatMoney(record.amount_in_trust)],
  ]);
}

const billableMattersList = createListCommand({
  apiPath: BILLABLE_MATTER_RESOURCE.apiPath,
  buildQuery: buildBillableMatterQuery,
  formatRow: formatBillableMatterRow,
  pluralLabel: BILLABLE_MATTER_RESOURCE.summaryLabels.plural,
  printList: printBillableMatterList,
  redactionResourceType: BILLABLE_MATTER_RESOURCE.redaction.resourceType,
  singularLabel: BILLABLE_MATTER_RESOURCE.summaryLabels.singular,
});

module.exports = {
  billableMattersList,
  __private: {
    buildBillableMatterQuery,
    formatBillableMatterRow,
    printBillableMatter,
    printBillableMatterList,
  },
};
