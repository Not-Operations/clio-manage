# Customer Testing

This document describes how security testing works for `not-manage`.

## Product model

`not-manage` is a local-only CLI.

- Customers install and run it on their own machines.
- Not Operations does not operate a hosted application server or database for the normal runtime path of this tool.
- Testing usually happens against a customer's own local install, a local build from source, or a developer-controlled Clio app and dataset.

## Allowed testing

Customers and their authorized delegates may test:

- the published npm package
- the public GitHub source code
- local OAuth setup and callback handling
- local credential storage behavior
- local redaction behavior
- command behavior against developer-controlled or otherwise authorized Clio environments

## Preferred testing conditions

- Use a local machine you control.
- Prefer non-production or otherwise low-risk test matters and data where possible.
- Do not include real client data in reports sent to Not Operations unless it is strictly necessary and already appropriately redacted or expressly coordinated.

## Reasonable restrictions

The following restrictions are intended to protect customers, Clio, and third-party providers while still allowing meaningful testing of `not-manage` itself:

- Do not test Clio systems, GitHub, npm, Vercel, or other third-party infrastructure beyond normal authorized use required to evaluate the CLI.
- Do not perform denial-of-service activity, excessive automated traffic, or disruptive testing.
- Do not attempt social engineering, phishing, physical intrusion, or attacks against accounts or datasets you do not own or control.
- Do not try to bypass contractual, legal, or professional-responsibility obligations that apply to law-firm or client data.
- Coordinate any destructive or high-volume testing with Not Operations in advance.

## Coordinating a test

If you want to coordinate a deeper review or have a customer delegate perform testing, contact:

- `hello@notoperations.com`

Use the subject line:

- `Security testing request: not-manage`

## Reporting issues

For vulnerabilities or security concerns, follow `SECURITY.md`.
