# Data Handling

This CLI is intended to minimize data movement, not eliminate risk.

## Normal flow

1. The user runs the CLI locally.
2. The CLI calls Clio directly.
3. The response is rendered locally in the terminal or JSON output.

## Sensitive data handling

- High-risk commands can return client-identifying, confidential, or privileged information.
- Redaction reduces risk but is best-effort only.
- Raw output can still expose names, matter labels, captions, custom fields, or other identifying details.

## Storage

- App credentials and OAuth tokens are stored in the OS keychain.
- The CLI does not write plaintext tokens to local config files by default.

## Safer use

- Prefer the default redacted output on high-risk commands.
- Use `--unredacted` only when the workflow actually requires raw data.
- Re-check output before sharing it with AI tools, tickets, chat, or email.
