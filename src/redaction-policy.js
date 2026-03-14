const DEFAULT_POLICY = {
  clientObjectKeys: new Set(["client", "clients", "contact", "contacts"]),
  contactLikeResource: false,
  freeTextFields: new Set(["description", "memo", "note", "reference", "subject"]),
  labelFields: new Set(["display_number", "number", "identifier", "title"]),
  matterLabelFields: new Set(["display_number", "number"]),
  safeIdentityObjectKeys: new Set([
    "user",
    "assignee",
    "assigner",
    "responsible_attorney",
    "responsible_staff",
    "originating_attorney",
  ]),
  safeIdentityResource: false,
};

const RESOURCE_POLICY_OVERRIDES = {
  "billable-client": {
    contactLikeResource: true,
  },
  contact: {
    contactLikeResource: true,
  },
  user: {
    safeIdentityResource: true,
  },
};

function getRedactionPolicy(resourceType) {
  return {
    ...DEFAULT_POLICY,
    ...(RESOURCE_POLICY_OVERRIDES[resourceType] || {}),
  };
}

module.exports = {
  getRedactionPolicy,
};
