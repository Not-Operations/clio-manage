const {
  clip,
  compactQuery,
  formatBoolean,
  parseLimit,
  printKeyValueRows,
  readContactName,
} = require("./resource-utils");
const { createGetCommand, createListCommand } = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const CONTACT_RESOURCE = getResourceMetadata("contacts");

function buildContactQuery(options) {
  return compactQuery({
    client_only: options.clientOnly ? true : undefined,
    clio_connect_only: options.clioConnectOnly ? true : undefined,
    created_since: options.createdSince || undefined,
    email_only: options.emailOnly ? true : undefined,
    fields: options.fields || CONTACT_RESOURCE.defaultFields.list,
    initial: options.initial || undefined,
    limit: parseLimit(options.limit),
    order: options.order || undefined,
    page_token: options.pageToken || undefined,
    query: options.query || undefined,
    type: options.type || undefined,
    updated_since: options.updatedSince || undefined,
  });
}

function formatContactRow(contact) {
  return {
    id: String(contact.id || "-"),
    name: readContactName(contact),
    type: String(contact.type || "-"),
    client: formatBoolean(contact.is_client),
    email: String(contact.primary_email_address || "-"),
    phone: String(contact.primary_phone_number || "-"),
  };
}

function printContactList(rows, options) {
  if (rows.length === 0) {
    console.log("No contacts found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       NAME                         TYPE         CLIENT EMAIL                        PHONE");
  console.log("-------- ---------------------------- ------------ ------ ---------------------------- ------------------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.name, 28).padEnd(28, " "),
      clip(row.type, 12).padEnd(12, " "),
      clip(row.client, 6).padEnd(6, " "),
      clip(row.email, 28).padEnd(28, " "),
      clip(row.phone, 18),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} contacts. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printContact(contact) {
  printKeyValueRows([
    ["ID", contact.id],
    ["Name", readContactName(contact)],
    ["Type", contact.type],
    ["Client", formatBoolean(contact.is_client)],
    ["Primary Email", contact.primary_email_address],
    ["Secondary Email", contact.secondary_email_address],
    ["Primary Phone", contact.primary_phone_number],
    ["Secondary Phone", contact.secondary_phone_number],
    ["Clio Connect Email", contact.clio_connect_email],
    ["Title", contact.title],
    ["Prefix", contact.prefix],
    ["Created", contact.created_at],
    ["Updated", contact.updated_at],
  ]);
}

const contactsList = createListCommand({
  apiPath: CONTACT_RESOURCE.apiPath,
  buildQuery: buildContactQuery,
  formatRow: formatContactRow,
  pluralLabel: CONTACT_RESOURCE.summaryLabels.plural,
  printList: printContactList,
  redactionResourceType: CONTACT_RESOURCE.redaction.resourceType,
  singularLabel: CONTACT_RESOURCE.summaryLabels.singular,
});

const contactsGet = createGetCommand({
  apiPath: CONTACT_RESOURCE.apiPath,
  defaultFields: CONTACT_RESOURCE.defaultFields.get,
  printItem: printContact,
  redactionResourceType: CONTACT_RESOURCE.redaction.resourceType,
  usage: "Usage: not-manage contacts get <id> [--fields ...] [--json]",
});

module.exports = {
  contactsGet,
  contactsList,
  __private: {
    buildContactQuery,
    formatContactRow,
    printContact,
    printContactList,
  },
};
