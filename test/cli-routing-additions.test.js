const path = require("node:path");
const test = require("node:test");
const assert = require("node:assert/strict");

const { loadWithMocks } = require("./helpers/module-test-utils");

const ROOT = path.resolve(__dirname, "..");

function loadCli() {
  const calls = {
    activitiesList: [],
    tasksGet: [],
    tasksList: [],
  };

  const { module, restore } = loadWithMocks(path.join(ROOT, "src/cli.js"), {
    "./commands-activities": {
      activitiesGet: async () => {},
      activitiesList: async (options) => {
        calls.activitiesList.push(options);
      },
    },
    "./commands-auth": {
      authLogin: async () => {},
      authRevoke: async () => {},
      authSetup: async () => {},
      authStatus: async () => {},
      maybeRunSetupOnFirstUse: async () => false,
      setupWizard: async () => {},
      whoAmI: async () => {},
    },
    "./commands-bills": {
      billsGet: async () => {},
      billsList: async () => {},
    },
    "./commands-billable-clients": {
      billableClientsList: async () => {},
    },
    "./commands-billable-matters": {
      billableMattersList: async () => {},
    },
    "./commands-contacts": {
      contactsGet: async () => {},
      contactsList: async () => {},
    },
    "./commands-matters": {
      mattersGet: async () => {},
      mattersList: async () => {},
    },
    "./commands-practice-areas": {
      practiceAreasGet: async () => {},
      practiceAreasList: async () => {},
    },
    "./commands-tasks": {
      tasksGet: async (options) => {
        calls.tasksGet.push(options);
      },
      tasksList: async (options) => {
        calls.tasksList.push(options);
      },
    },
    "./commands-users": {
      usersGet: async () => {},
      usersList: async () => {},
    },
  });

  return { calls, restore, run: module.run };
}

test("cli routes activities list client filters", async () => {
  const { calls, restore, run } = loadCli();

  try {
    await run([
      "activities",
      "list",
      "--client-id",
      "999",
      "--status",
      "unbilled",
      "--json",
    ]);

    assert.deepStrictEqual(calls.activitiesList, [
      {
        activityDescriptionId: undefined,
        all: false,
        clientId: "999",
        createdSince: undefined,
        endDate: undefined,
        fields: undefined,
        flatRate: undefined,
        json: true,
        limit: undefined,
        matterId: undefined,
        onlyUnaccountedFor: false,
        order: undefined,
        pageToken: undefined,
        query: undefined,
        redacted: false,
        startDate: undefined,
        status: "unbilled",
        taskId: undefined,
        type: undefined,
        updatedSince: undefined,
        userId: undefined,
      },
    ]);
  } finally {
    restore();
  }
});

test("cli routes tasks list filters", async () => {
  const { calls, restore, run } = loadCli();

  try {
    await run([
      "tasks",
      "list",
      "--client-id",
      "12",
      "--matter-id",
      "45",
      "--complete",
      "false",
      "--due-at-from",
      "2026-03-01",
      "--task-type-id",
      "77",
      "--json",
    ]);

    assert.deepStrictEqual(calls.tasksList, [
      {
        all: false,
        clientId: "12",
        complete: false,
        createdSince: undefined,
        dueAtFrom: "2026-03-01",
        dueAtTo: undefined,
        fields: undefined,
        json: true,
        limit: undefined,
        matterId: "45",
        order: undefined,
        pageToken: undefined,
        priority: undefined,
        query: undefined,
        redacted: false,
        responsibleAttorneyId: undefined,
        status: undefined,
        taskTypeId: "77",
        updatedSince: undefined,
      },
    ]);
  } finally {
    restore();
  }
});

test("cli routes tasks get", async () => {
  const { calls, restore, run } = loadCli();

  try {
    await run(["tasks", "get", "789", "--fields", "id,name", "--redacted"]);

    assert.deepStrictEqual(calls.tasksGet, [
      {
        fields: "id,name",
        id: "789",
        json: false,
        redacted: true,
      },
    ]);
  } finally {
    restore();
  }
});
