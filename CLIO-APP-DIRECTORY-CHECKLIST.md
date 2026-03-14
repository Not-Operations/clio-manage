# Clio App Directory Checklist

Updated: 2026-03-13

This document is a practical launch checklist for listing `not-manage` in the Clio App Directory.

## Public URLs to provide

Current best public URLs from this repository:

- Website: `https://notoperations.com/not-manage-cli`
- Terms of Service: `https://github.com/Not-Operations/not-manage/blob/main/TERMS.md`
- Privacy Policy: `https://github.com/Not-Operations/not-manage/blob/main/PRIVACY.md`
- Security Policy: `https://github.com/Not-Operations/not-manage/blob/main/SECURITY.md`
- Support Site: `https://github.com/Not-Operations/not-manage/blob/main/SUPPORT.md`
- Customer Testing: `https://github.com/Not-Operations/not-manage/blob/main/CUSTOMER-TESTING.md`
- Subprocessors: `https://github.com/Not-Operations/not-manage/blob/main/SUBPROCESSORS.md`
- MVSP Self-Assessment: `https://github.com/Not-Operations/not-manage/blob/main/MVSP-SELF-ASSESSMENT.md`

Contact details:

- Support contact: `hello@notoperations.com`
- Sales/product contact: `hello@notoperations.com`

## What is now in place

- public terms, privacy, security, data-handling, and operations docs
- public support page
- public customer testing policy
- public subprocessor/service provider list
- annual MVSP self-assessment for the local-only CLI architecture
- documented remediation targets and incident-notification commitment

## Remaining high-priority gaps

These are the main items still outside the repo-only fix:

1. Publish the same trust links directly on `https://notoperations.com/not-manage-cli`.
2. Publish `security.txt` at `https://notoperations.com/.well-known/security.txt`.
3. Complete a third-party penetration test and retain the report.
4. Retain evidence of role-specific security training.
5. Be prepared to complete Clio's Securiti questionnaire with the same architecture story used in `MVSP-SELF-ASSESSMENT.md`.

## Recommended website additions

Add a small trust/compliance section to `https://notoperations.com/not-manage-cli` with direct links to:

- Terms
- Privacy
- Security
- Support
- MVSP self-assessment

Suggested supporting copy:

> `not-manage` is a local-only CLI. In normal runtime, Clio data flows directly from Clio to the user's machine. Not Operations does not run a hosted backend that stores Clio matter, billing, contact, or task data for this tool.

Suggested secondary copy:

> Security reports: `hello@notoperations.com`  
> Support: GitHub issues or `hello@notoperations.com`

## Suggested listing copy

Short description options:

- `Local CLI access to Clio Manage`
- `A local command line tool for Clio`
- `Run Clio Manage workflows from your terminal`

Keywords:

- `clio`
- `cli`
- `terminal`
- `legal operations`
- `workflow automation`

Key benefits to emphasize:

1. `Local by default`
   The CLI talks directly to Clio from the user's machine and stores credentials in the local OS keychain instead of a Not Operations-hosted backend.
2. `Built for technical legal workflows`
   Pull Clio data into scripts, terminal workflows, and AI-assisted development setups without building your own OAuth and pagination layer first.
3. `Open and reviewable`
   The source, security docs, privacy docs, and support policies are public so firms can review the tool before using it.
