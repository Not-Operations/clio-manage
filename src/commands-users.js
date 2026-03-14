const {
  clip,
  compactQuery,
  formatBoolean,
  parseLimit,
  printKeyValueRows,
  readUserName,
} = require("./resource-utils");
const { createGetCommand, createListCommand } = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const USER_RESOURCE = getResourceMetadata("users");

function readRoleList(user) {
  const roles = Array.isArray(user?.roles) ? user.roles : [];
  if (roles.length === 0) {
    return "-";
  }
  return roles.join(", ");
}

function buildUserQuery(options) {
  return compactQuery({
    created_since: options.createdSince || undefined,
    enabled:
      options.enabled === undefined || options.enabled === null
        ? undefined
        : Boolean(options.enabled),
    fields: options.fields || USER_RESOURCE.defaultFields.list,
    include_co_counsel: options.includeCoCounsel ? true : undefined,
    limit: parseLimit(options.limit, 2000),
    name: options.name || undefined,
    order: options.order || undefined,
    page_token: options.pageToken || undefined,
    pending_setup:
      options.pendingSetup === undefined || options.pendingSetup === null
        ? undefined
        : Boolean(options.pendingSetup),
    role: options.role || undefined,
    subscription_type: options.subscriptionType || undefined,
    updated_since: options.updatedSince || undefined,
  });
}

function formatUserRow(user) {
  return {
    id: String(user.id || "-"),
    name: readUserName(user),
    email: String(user.email || "-"),
    enabled: formatBoolean(user.enabled),
    roles: readRoleList(user),
  };
}

function printUserList(rows, options) {
  if (rows.length === 0) {
    console.log("No users found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       NAME                         EMAIL                        ENABLED ROLES");
  console.log("-------- ---------------------------- ---------------------------- ------- ------------------------------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.name, 28).padEnd(28, " "),
      clip(row.email, 28).padEnd(28, " "),
      clip(row.enabled, 7).padEnd(7, " "),
      clip(row.roles, 30),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} users. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printUser(user) {
  printKeyValueRows([
    ["ID", user.id],
    ["Name", readUserName(user)],
    ["Email", user.email],
    ["Enabled", formatBoolean(user.enabled)],
    ["Roles", readRoleList(user)],
    ["Subscription", user.subscription_type],
    ["Phone", user.phone_number],
    ["Time Zone", user.time_zone],
    ["Rate", user.rate],
    ["Account Owner", formatBoolean(user.account_owner)],
    ["Clio Connect", formatBoolean(user.clio_connect)],
    ["Court Rules Default Attendee", formatBoolean(user.court_rules_default_attendee)],
    ["Created", user.created_at],
    ["Updated", user.updated_at],
  ]);
}

const usersList = createListCommand({
  apiPath: USER_RESOURCE.apiPath,
  buildQuery: buildUserQuery,
  formatRow: formatUserRow,
  pluralLabel: USER_RESOURCE.summaryLabels.plural,
  printList: printUserList,
  redactionResourceType: USER_RESOURCE.redaction.resourceType,
  singularLabel: USER_RESOURCE.summaryLabels.singular,
});

const usersGet = createGetCommand({
  apiPath: USER_RESOURCE.apiPath,
  defaultFields: USER_RESOURCE.defaultFields.get,
  printItem: printUser,
  redactionResourceType: USER_RESOURCE.redaction.resourceType,
  usage: "Usage: not-manage users get <id> [--fields ...] [--json]",
});

module.exports = {
  usersGet,
  usersList,
  __private: {
    buildUserQuery,
    formatUserRow,
    printUser,
    printUserList,
  },
};
