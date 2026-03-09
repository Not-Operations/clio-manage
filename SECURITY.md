# Security Policy

This CLI handles OAuth credentials and can access sensitive law-firm data. Treat security reports accordingly.

## Reporting a vulnerability

- Do not open a public issue with exploit details, credentials, tokens, or client data.
- If GitHub private vulnerability reporting is enabled for this repository, use it.
- Otherwise, contact the maintainers through the repository owner's public contact channel and request a private disclosure path before sharing technical details.

Include:

- affected version or commit
- reproduction steps
- impact
- suggested remediation if you have one

## Sensitive data

- Never include real client records, billing data, matter data, access tokens, refresh tokens, or client secrets in issues or pull requests.
- Redact screenshots and command output before sharing them.

## Scope

Security issues include, for example:

- OAuth redirect or callback vulnerabilities
- token leakage or insecure token storage
- command output that exposes secrets or client data
- dependency or update paths that enable credential theft
