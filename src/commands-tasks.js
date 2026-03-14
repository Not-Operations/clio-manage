const {
  clip,
  compactQuery,
  formatBoolean,
  parseLimit,
  printKeyValueRows,
  readMatterLabel,
  readUserName,
} = require("./resource-utils");
const { createGetCommand, createListCommand } = require("./resource-command-runner");
const { getResourceMetadata } = require("./resource-metadata");

const TASK_RESOURCE = getResourceMetadata("tasks");

function readTaskStatus(status) {
  if (!status) {
    return "-";
  }

  if (typeof status === "string") {
    return status;
  }

  return status.name || status.value || status.state || "-";
}

function readTaskComplete(task) {
  if (typeof task?.complete === "boolean") {
    return task.complete;
  }

  if (typeof task?.status === "string") {
    return task.status.toLowerCase() === "complete";
  }

  return undefined;
}

function buildTaskQuery(options) {
  return compactQuery({
    client_id: options.clientId || undefined,
    complete:
      options.complete === undefined || options.complete === null
        ? undefined
        : Boolean(options.complete),
    created_since: options.createdSince || undefined,
    due_at_from: options.dueAtFrom || undefined,
    due_at_to: options.dueAtTo || undefined,
    fields: options.fields || TASK_RESOURCE.defaultFields.list,
    limit: parseLimit(options.limit),
    matter_id: options.matterId || undefined,
    order: options.order || undefined,
    page_token: options.pageToken || undefined,
    priority: options.priority || undefined,
    query: options.query || undefined,
    responsible_attorney_id: options.responsibleAttorneyId || undefined,
    status: options.status || undefined,
    task_type_id: options.taskTypeId || undefined,
    updated_since: options.updatedSince || undefined,
  });
}

function formatTaskRow(task) {
  return {
    id: String(task.id || "-"),
    status: String(readTaskStatus(task.status)),
    dueAt: String(task.due_at || "-"),
    priority: String(task.priority || "-"),
    matter: readMatterLabel(task.matter),
    task: String(task.name || "-"),
  };
}

function printTaskList(rows, options) {
  if (rows.length === 0) {
    console.log("No tasks found for the selected filters.");
    return;
  }

  const visibleRows = rows.slice(0, 50);
  console.log("ID       STATUS       DUE          PRIORITY MATTER               TASK");
  console.log("-------- ------------ ------------ -------- -------------------- ------------------------------");

  visibleRows.forEach((row) => {
    const line = [
      clip(row.id, 8).padEnd(8, " "),
      clip(row.status, 12).padEnd(12, " "),
      clip(row.dueAt, 12).padEnd(12, " "),
      clip(row.priority, 8).padEnd(8, " "),
      clip(row.matter, 20).padEnd(20, " "),
      clip(row.task, 30),
    ].join(" ");

    console.log(line);
  });

  if (rows.length > visibleRows.length) {
    console.log(`Showing ${visibleRows.length} of ${rows.length} tasks. Use --json for full output.`);
  }

  if (!options.all && options.nextPageUrl) {
    console.log("");
    console.log("More results are available.");
    console.log("Run again with `--all` or pass `--page-token` from `--json` output.");
  }
}

function printTask(task) {
  printKeyValueRows([
    ["ID", task.id],
    ["Name", task.name],
    ["Description", task.description],
    ["Status", readTaskStatus(task.status)],
    ["Priority", task.priority],
    ["Due", task.due_at],
    ["Complete", formatBoolean(readTaskComplete(task))],
    ["Matter", readMatterLabel(task.matter)],
    ["Assignee", readUserName(task.assignee)],
    ["Assigner", readUserName(task.assigner)],
    ["Task Type", task.task_type?.name],
    ["Created", task.created_at],
    ["Updated", task.updated_at],
  ]);
}

const tasksList = createListCommand({
  apiPath: TASK_RESOURCE.apiPath,
  buildQuery: buildTaskQuery,
  formatRow: formatTaskRow,
  pluralLabel: TASK_RESOURCE.summaryLabels.plural,
  printList: printTaskList,
  redactionResourceType: TASK_RESOURCE.redaction.resourceType,
  singularLabel: TASK_RESOURCE.summaryLabels.singular,
});

const tasksGet = createGetCommand({
  apiPath: TASK_RESOURCE.apiPath,
  defaultFields: TASK_RESOURCE.defaultFields.get,
  printItem: printTask,
  redactionResourceType: TASK_RESOURCE.redaction.resourceType,
  usage: "Usage: not-manage tasks get <id> [--fields ...] [--json]",
});

module.exports = {
  tasksGet,
  tasksList,
  __private: {
    buildTaskQuery,
    formatTaskRow,
    readTaskComplete,
    printTask,
    printTaskList,
    readTaskStatus,
  },
};
