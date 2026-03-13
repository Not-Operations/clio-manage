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

## Local-only security model

- The CLI is designed to run locally on the user's device.
- Clio data is fetched directly from Clio to the local machine.
- OAuth credentials and tokens are stored in the OS keychain.
- Redaction reduces risk but is best-effort only and must not be treated as a guarantee.

## Scope

Security issues include, for example:

- OAuth redirect or callback vulnerabilities
- token leakage or insecure token storage
- command output that exposes secrets or client data
- terminal prompts or logs that echo app secrets, access tokens, or refresh tokens
- pagination or follow-up requests that could leak bearer tokens to non-Clio hosts
- dependency or update paths that enable credential theft

## Repository controls

Maintain branch protection on the default branch so merges require the `CI`, `Dependency Review`, and `CodeQL` checks to pass.
For releases, publish through the GitHub Actions release workflow so npm provenance is attached to the package.
