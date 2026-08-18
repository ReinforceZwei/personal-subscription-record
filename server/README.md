# personal-subscription-record (server)

PocketBase-based backend written in Go. Replaces the PocketBase binary + JS migrations
with a proper backend server that embeds PocketBase as a framework, following the same
structure as [anime-list-next/server](https://github.com/ReinforceZwei/anime-list-next/tree/main/server).

## Setup & Run

```sh
cd server

# Create .env with required values
cp .env.example .env  # or create manually

# Run in development (auto-migrate enabled when launched via go run)
go run . serve

# Run tests (none yet)
go test ./...
```

**Optional env** — `server/.env`:
```
DISABLE_REGISTER=false   # set true to lock registration after first user
```

## How to view collection schema

Read migration files in `migrations/` or use the PocketBase admin UI (`/_/`).

## Design

### `/config`

custom config (not PocketBase config), loaded from environment variables:

- `DISABLE_REGISTER` — when true, only the first account can be created

### `/hooks`

PocketBase record lifecycle hooks:

- `users` — optional registration lock (see `DISABLE_REGISTER`)

### `/routes`

custom API routes:

- `/api/version` — returns the build version, commit and date

### Static files

The server serves the built frontend from `./pb_public` (same behaviour as the
official PocketBase binary). Drop a `vite build` output there, or run the
frontend dev server separately and point `VITE_PB_URL` at this server.

## Collections

Managed by PocketBase migrations (`migrations/`), ported from the original
JavaScript snapshot (`pocketbase/migrations/1744081419_collections_snapshot.js`):

| Collection | Type | Notes |
|------------|------|-------|
| `users` | auth | built-in; OAuth2 + email/username login restored by `updated_users` migration |
| `spentTypes` | base | spending categories |
| `spentRecords` | base | individual spending records |
| `paymentMethods` | base | payment methods |
| `subscriptionPlans` | base | subscription plans |
| `spentPresets` | base | quick-create presets |
| `userSettings` | base | per-user settings (unique per `owned_by`) |
| `budgetHistory` | base | monthly budget history |
| `spentRecordNames` | view | distinct record names with usage count |
| `spentSumByMonth` | view | total spent per month |
| `spentSumByTypeMonth` | view | total spent per type per month |

Notes on the port:

- The leftover `test` collection from the old snapshot is **not** migrated — it is
  unused by the application.
- System collections (`_superusers`, `_externalAuths`, `_mfas`, `_otps`, `_authOrigins`)
  are created by the PocketBase framework itself and are not part of the migrations.
- All relation fields keep their original collection and field ids, so existing
  `pb_data` databases keep working.

## Pre-PR Checks

```sh
cd server && go build ./... && go vet ./...
```
