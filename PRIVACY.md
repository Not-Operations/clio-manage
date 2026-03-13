# Privacy

`clio-manage` is designed to run locally on the user's device.

## Local-only model

- The CLI talks directly to Clio from the local machine.
- Not Operations does not operate a hosted service that stores Clio matter, contact, billing, or task data for this CLI.
- OAuth credentials and tokens are stored in the local OS keychain.

## What can leave the device

- Requests sent directly to Clio during normal CLI use.
- Anything the user explicitly copies, pastes, exports, screenshots, or sends to another tool.

## What this project does not claim

- It does not guarantee de-identification.
- It does not guarantee privilege-safe output.
- It does not decide whether a downstream AI tool or vendor is approved for a user's firm.

## User responsibility

- Review output before sharing it outside the firm.
- Use only vendors, workflows, and policies the firm has approved.
- Avoid sharing raw or `--unredacted` output unless there is a clear need and permission to do so.
