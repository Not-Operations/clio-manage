# Subprocessors and Service Providers

Last reviewed: 2026-03-13

## Runtime model

`not-manage` is a local-only CLI.

- In normal runtime, Clio API responses go directly from Clio to the user's machine.
- Not Operations does not operate a hosted backend that receives or stores Clio matter, billing, task, or contact data for this tool.
- Because of that architecture, there is no Not Operations-hosted runtime subprocessor in the normal Clio data path for `not-manage`.

## Supporting service providers

These providers support distribution, source hosting, or public documentation for the product. They are not intended to receive Clio API payloads during normal CLI runtime.

| Provider | Purpose | Normal access to Clio customer data |
| --- | --- | --- |
| `GitHub` | Source hosting, issue tracking, CI workflows, release source of truth | `No`, unless a user voluntarily submits screenshots, logs, patches, or other support artifacts |
| `npm, Inc.` | Package distribution for the published CLI | `No` |
| `Vercel` | Hosting of `notoperations.com` marketing and documentation pages | `No` |

## Support and exception handling

If a user voluntarily sends support material by email, through GitHub, or through another support channel, that material may contain customer data if the user chooses to include it. Users should minimize or redact such data before sending it.

## Review process

Not Operations intends to:

- keep the list of providers for this product current
- review relevant providers at least annually against the latest MVSP baseline or an equivalent internal checklist
- update this document when a provider materially changes or a new provider is added to the product's public surface
