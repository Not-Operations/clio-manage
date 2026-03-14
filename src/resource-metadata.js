const ACTIVITY_FIELDS =
  "id,type,date,quantity,quantity_in_hours,rounded_quantity,rounded_quantity_in_hours,price,total,billed,on_bill,non_billable,no_charge,flat_rate,contingency_fee,note,reference,created_at,updated_at,activity_description{id,name},bill{id,number,state},matter{id,display_number,number,description},user{id,name,first_name,last_name,email}";
const BILL_FIELDS =
  "id,number,state,type,kind,subject,memo,issued_at,due_at,paid,paid_at,pending,due,total,balance,created_at,updated_at,client{id,name,first_name,last_name},matters{id,display_number,number,description}";
const CONTACT_FIELDS =
  "id,name,first_name,last_name,type,is_client,primary_email_address,secondary_email_address,primary_phone_number,secondary_phone_number,clio_connect_email,title,prefix,created_at,updated_at";
const MATTER_FIELDS =
  "id,display_number,number,description,status,billable,open_date,close_date,pending_date,client{id,name,first_name,last_name},practice_area{id,name},responsible_attorney{id,name,email},responsible_staff{id,name,email},originating_attorney{id,name,email},created_at,updated_at";
const PRACTICE_AREA_FIELDS = "id,code,name,category,created_at,updated_at";
const TASK_FIELDS =
  "id,name,description,status,priority,due_at,created_at,updated_at,matter{id,display_number,number,description,client},assignee{id,name},assigner{id,name},task_type{id,name}";
const USER_FIELDS =
  "id,name,first_name,last_name,email,enabled,roles,subscription_type,phone_number,time_zone,rate,account_owner,clio_connect,court_rules_default_attendee,created_at,updated_at";
const BILLABLE_MATTER_FIELDS =
  "id,display_number,unbilled_hours,unbilled_amount,amount_in_trust,client{id,name,first_name,last_name}";
const BILLABLE_CLIENT_FIELDS =
  "id,name,unbilled_hours,unbilled_amount,amount_in_trust,billable_matters_count";

const RESOURCE_ORDER = [
  "activities",
  "tasks",
  "contacts",
  "time-entries",
  "billable-clients",
  "billable-matters",
  "bills",
  "invoices",
  "matters",
  "users",
  "practice-areas",
];

const RESOURCE_METADATA = {
  activities: {
    aliases: ["activity"],
    apiPath: "activities",
    defaultFields: {
      get: ACTIVITY_FIELDS,
      list: ACTIVITY_FIELDS,
    },
    handlerKey: "activities",
    help: {
      get: "Fetch a single activity by id",
      list: "List activities with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        activityDescriptionId: { kind: "string", option: "activity-description-id" },
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        createdSince: { kind: "string", option: "created-since" },
        endDate: { kind: "iso-date", option: "end-date" },
        fields: { kind: "string", option: "fields" },
        flatRate: { kind: "boolean", option: "flat-rate" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        onlyUnaccountedFor: { kind: "flag", option: "only-unaccounted-for" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        startDate: { kind: "iso-date", option: "start-date" },
        status: { kind: "string", option: "status" },
        taskId: { kind: "string", option: "task-id" },
        type: { kind: "string", option: "type" },
        updatedSince: { kind: "string", option: "updated-since" },
        userId: { kind: "string", option: "user-id" },
      },
    },
    redaction: {
      resourceType: "activity",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "activities",
      singular: "activity",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  "billable-clients": {
    aliases: ["billable-client"],
    apiPath: "billable_clients",
    defaultFields: {
      list: BILLABLE_CLIENT_FIELDS,
    },
    handlerKey: "billable-clients",
    help: {
      list: "List clients with unbilled activity",
    },
    optionSchema: {
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        endDate: { kind: "iso-date", option: "end-date" },
        fields: { kind: "string", option: "fields" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        originatingAttorneyId: { kind: "string", option: "originating-attorney-id" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        responsibleAttorneyId: { kind: "string", option: "responsible-attorney-id" },
        startDate: { kind: "iso-date", option: "start-date" },
      },
    },
    redaction: {
      resourceType: "billable-client",
      warningLevel: "standard",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "billable clients",
      singular: "billable client",
    },
    supports: {
      get: false,
      list: true,
    },
  },
  "billable-matters": {
    aliases: ["billable-matter"],
    apiPath: "billable_matters",
    defaultFields: {
      list: BILLABLE_MATTER_FIELDS,
    },
    handlerKey: "billable-matters",
    help: {
      list: "List matters with unbilled activity",
    },
    optionSchema: {
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        endDate: { kind: "iso-date", option: "end-date" },
        fields: { kind: "string", option: "fields" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        originatingAttorneyId: { kind: "string", option: "originating-attorney-id" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        responsibleAttorneyId: { kind: "string", option: "responsible-attorney-id" },
        startDate: { kind: "iso-date", option: "start-date" },
      },
    },
    redaction: {
      resourceType: "billable-matter",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "billable matters",
      singular: "billable matter",
    },
    supports: {
      get: false,
      list: true,
    },
  },
  bills: {
    aliases: ["bill"],
    apiPath: "bills",
    defaultFields: {
      get: BILL_FIELDS,
      list: BILL_FIELDS,
    },
    handlerKey: "bills",
    help: {
      get: "Fetch a single bill by id",
      list: "List bills with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        createdSince: { kind: "string", option: "created-since" },
        dueAfter: { kind: "iso-date", option: "due-after" },
        dueBefore: { kind: "iso-date", option: "due-before" },
        fields: { kind: "string", option: "fields" },
        issuedAfter: { kind: "iso-date", option: "issued-after" },
        issuedBefore: { kind: "iso-date", option: "issued-before" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        order: { kind: "string", option: "order" },
        overdueOnly: { kind: "flag", option: "overdue-only" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        state: { kind: "string", option: "state" },
        status: { kind: "string", option: "status" },
        type: { kind: "string", option: "type" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "bill",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "bills",
      singular: "bill",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  contacts: {
    aliases: ["contact"],
    apiPath: "contacts",
    defaultFields: {
      get: CONTACT_FIELDS,
      list: CONTACT_FIELDS,
    },
    handlerKey: "contacts",
    help: {
      get: "Fetch a single contact by id",
      list: "List contacts with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        clientOnly: { kind: "flag", option: "client-only" },
        clioConnectOnly: { kind: "flag", option: "clio-connect-only" },
        createdSince: { kind: "string", option: "created-since" },
        emailOnly: { kind: "flag", option: "email-only" },
        fields: { kind: "string", option: "fields" },
        initial: { kind: "string", option: "initial" },
        limit: { kind: "string", option: "limit" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        type: { kind: "string", option: "type" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "contact",
      warningLevel: "standard",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "contacts",
      singular: "contact",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  invoices: {
    aliases: ["invoice"],
    apiPath: "bills",
    defaultFields: {
      get: BILL_FIELDS,
      list: BILL_FIELDS,
    },
    handlerKey: "bills",
    help: {
      get: "Alias for bills get",
      list: "Alias for bills list",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        createdSince: { kind: "string", option: "created-since" },
        dueAfter: { kind: "iso-date", option: "due-after" },
        dueBefore: { kind: "iso-date", option: "due-before" },
        fields: { kind: "string", option: "fields" },
        issuedAfter: { kind: "iso-date", option: "issued-after" },
        issuedBefore: { kind: "iso-date", option: "issued-before" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        order: { kind: "string", option: "order" },
        overdueOnly: { kind: "flag", option: "overdue-only" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        state: { kind: "string", option: "state" },
        status: { kind: "string", option: "status" },
        type: { kind: "string", option: "type" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "bill",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "bills",
      singular: "bill",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  matters: {
    aliases: ["matter"],
    apiPath: "matters",
    defaultFields: {
      get: MATTER_FIELDS,
      list: MATTER_FIELDS,
    },
    handlerKey: "matters",
    help: {
      get: "Fetch a single matter by id",
      list: "List matters with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        createdSince: { kind: "string", option: "created-since" },
        fields: { kind: "string", option: "fields" },
        limit: { kind: "string", option: "limit" },
        order: { kind: "string", option: "order" },
        originatingAttorneyId: { kind: "string", option: "originating-attorney-id" },
        pageToken: { kind: "string", option: "page-token" },
        practiceAreaId: { kind: "string", option: "practice-area-id" },
        query: { kind: "string", option: "query" },
        responsibleAttorneyId: { kind: "string", option: "responsible-attorney-id" },
        responsibleStaffId: { kind: "string", option: "responsible-staff-id" },
        status: { kind: "string", option: "status" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "matter",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "matters",
      singular: "matter",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  "practice-areas": {
    aliases: ["practice-area"],
    apiPath: "practice_areas",
    defaultFields: {
      get: PRACTICE_AREA_FIELDS,
      list: PRACTICE_AREA_FIELDS,
    },
    handlerKey: "practice-areas",
    help: {
      get: "Fetch a single practice area by id",
      list: "List practice areas with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        code: { kind: "string", option: "code" },
        createdSince: { kind: "string", option: "created-since" },
        fields: { kind: "string", option: "fields" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        name: { kind: "string", option: "name" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "practice-area",
      warningLevel: "none",
    },
    riskLevel: "low",
    summaryLabels: {
      plural: "practice areas",
      singular: "practice area",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  tasks: {
    aliases: ["task"],
    apiPath: "tasks",
    defaultFields: {
      get: TASK_FIELDS,
      list: TASK_FIELDS,
    },
    handlerKey: "tasks",
    help: {
      get: "Fetch a single task by id",
      list: "List tasks with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        complete: { kind: "boolean", option: "complete" },
        createdSince: { kind: "string", option: "created-since" },
        dueAtFrom: { kind: "iso-date", option: "due-at-from" },
        dueAtTo: { kind: "iso-date", option: "due-at-to" },
        fields: { kind: "string", option: "fields" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        priority: { kind: "string", option: "priority" },
        query: { kind: "string", option: "query" },
        responsibleAttorneyId: { kind: "string", option: "responsible-attorney-id" },
        status: { kind: "string", option: "status" },
        taskTypeId: { kind: "string", option: "task-type-id" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "task",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "tasks",
      singular: "task",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  "time-entries": {
    aliases: ["time-entry"],
    apiPath: "activities",
    defaultFields: {
      get: ACTIVITY_FIELDS,
      list: ACTIVITY_FIELDS,
    },
    fixedOptions: {
      list: {
        type: "TimeEntry",
      },
    },
    handlerKey: "activities",
    help: {
      get: "Alias for activities get",
      list: "Alias for activities list filtered to TimeEntry",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        activityDescriptionId: { kind: "string", option: "activity-description-id" },
        all: { kind: "flag", option: "all" },
        clientId: { kind: "string", option: "client-id" },
        createdSince: { kind: "string", option: "created-since" },
        endDate: { kind: "iso-date", option: "end-date" },
        fields: { kind: "string", option: "fields" },
        flatRate: { kind: "boolean", option: "flat-rate" },
        limit: { kind: "string", option: "limit" },
        matterId: { kind: "string", option: "matter-id" },
        onlyUnaccountedFor: { kind: "flag", option: "only-unaccounted-for" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        query: { kind: "string", option: "query" },
        startDate: { kind: "iso-date", option: "start-date" },
        status: { kind: "string", option: "status" },
        taskId: { kind: "string", option: "task-id" },
        updatedSince: { kind: "string", option: "updated-since" },
        userId: { kind: "string", option: "user-id" },
      },
    },
    redaction: {
      resourceType: "activity",
      warningLevel: "limited",
    },
    riskLevel: "high",
    summaryLabels: {
      plural: "activities",
      singular: "activity",
    },
    supports: {
      get: true,
      list: true,
    },
  },
  users: {
    aliases: ["user"],
    apiPath: "users",
    defaultFields: {
      get: USER_FIELDS,
      list: USER_FIELDS,
    },
    handlerKey: "users",
    help: {
      get: "Fetch a single user by id",
      list: "List users with filters and pagination",
    },
    optionSchema: {
      get: {
        fields: { kind: "string", option: "fields" },
        id: { positional: 0 },
      },
      list: {
        all: { kind: "flag", option: "all" },
        createdSince: { kind: "string", option: "created-since" },
        enabled: { kind: "boolean", option: "enabled" },
        fields: { kind: "string", option: "fields" },
        includeCoCounsel: { kind: "flag", option: "include-co-counsel" },
        limit: { kind: "string", option: "limit" },
        name: { kind: "string", option: "name" },
        order: { kind: "string", option: "order" },
        pageToken: { kind: "string", option: "page-token" },
        pendingSetup: { kind: "boolean", option: "pending-setup" },
        role: { kind: "string", option: "role" },
        subscriptionType: { kind: "string", option: "subscription-type" },
        updatedSince: { kind: "string", option: "updated-since" },
      },
    },
    redaction: {
      resourceType: "user",
      warningLevel: "none",
    },
    riskLevel: "low",
    summaryLabels: {
      plural: "users",
      singular: "user",
    },
    supports: {
      get: true,
      list: true,
    },
  },
};

const ALIAS_TO_COMMAND = RESOURCE_ORDER.reduce((aliases, command) => {
  const metadata = RESOURCE_METADATA[command];
  metadata.aliases.forEach((alias) => {
    aliases[alias] = command;
  });
  return aliases;
}, {});

function getResourceMetadata(command) {
  return RESOURCE_METADATA[command];
}

function listResourceMetadata() {
  return RESOURCE_ORDER.map((command) => RESOURCE_METADATA[command]);
}

function normalizeResourceCommand(command) {
  return ALIAS_TO_COMMAND[command] || command;
}

module.exports = {
  RESOURCE_METADATA,
  RESOURCE_ORDER,
  getResourceMetadata,
  listResourceMetadata,
  normalizeResourceCommand,
};
