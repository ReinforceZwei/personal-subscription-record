# server — Go + PocketBase Backend

## Package Identity

PocketBase-based backend written in Go for the SSRS (Spending and Subscription Record)
app. Extends PocketBase with custom API routes and record lifecycle hooks, mirroring the
structure of anime-list-next/server.

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

## Patterns & Conventions

### Module path

Go module is `github.com/ReinforceZwei/personal-subscription-record/server` — all internal
imports use this prefix:
```go
import "github.com/ReinforceZwei/personal-subscription-record/server/hooks"
```

### Custom API Routes

- Routes are registered in `routes/` as structs implementing a `Register(se *core.ServeEvent)` method
- Group custom endpoints under `/api`
- Use `apis.RequireAuth()` to bind group-level auth middleware — see `routes/importexport.go` in anime-list-next for the pattern
- Return errors via `e.JSON(http.StatusXxx, ...)` or PocketBase's `apis.NewXxxError(...)` helpers
- Adding a new route:
  1. Create `routes/mything.go` with a struct + `Register` method
  2. Instantiate and call `.Register(se)` inside `app.OnServe().BindFunc(...)` in `main.go`

### PocketBase Hooks

- Hooks are in `hooks/` as structs with a `Register(app core.App)` method
- Hook into PocketBase events with `app.OnRecordCreate("collectionName").BindFunc(...)`
- Always call `e.Next()` at the end of a hook to continue the chain
- Errors in background-only operations should be **logged, not returned** so the main operation still succeeds

### Migrations

- The initial schema lives in `migrations/1787011200_import_collections_snapshot.go`,
  a Go port of the original JS snapshot (`pocketbase/migrations/1744081419_collections_snapshot.js`)
- `migrations/1787011201_updated_users.go` restores the auth options (OAuth2, email/username login, token durations)
- Auto-migrate is enabled only when launched with `go run` (`osutils.IsProbablyGoRun()` check in `main.go`)
- To inspect current schema: read migration files in `migrations/` or use the PocketBase admin UI
- Future schema changes: create `migrations/<unix>_updated_<collection>.go` files (see anime-list-next for examples)

### Config

- Loaded from environment via `config/config.go`
- Access config in `main.go` and pass to hooks/routes via constructors — never read `os.Getenv` outside `config/`

## Key Files

- Entry point + wiring: `main.go`
- Config loading: `config/config.go`
- Users registration hook: `hooks/users.go`
- Version route: `routes/version.go`

## Common Gotchas

- Auto-migrate only runs under `go run` — running the compiled binary does NOT auto-migrate;
  apply migrations by running `go run . migrate up` or via `go run . serve` in dev
- The snapshot import uses `ImportCollectionsByMarshaledJSON` (not per-collection `app.Save`)
  because the JS snapshot relied on `importCollections` semantics: it saves with validation
  deferred so self-referencing relations (e.g. `paymentMethods.payment`) and cross-collection
  relation ordering work on a fresh database
- The leftover `test` collection from the old snapshot is intentionally NOT migrated

## JIT Index Hints

```sh
# Find all hook registrations
rg -n "BindFunc\|OnRecord" server/hooks/

# Find all custom route handlers
rg -n "func.*Handler\|\.GET\|\.POST" server/routes/

# Find all config keys
rg -n "os\.Getenv" server/config/

# Find all migration files (sorted = chronological)
ls server/migrations/
```

## Pre-PR Checks

```sh
cd server && go build ./... && go vet ./...
```
