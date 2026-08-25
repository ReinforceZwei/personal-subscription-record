# Domain model

Naming convention is changed from `snake_case` to `camelCase` for collection name and field name in v2, matching JavaScript style.

## 1. Transaction model

- accounts (bank, cash, credit card, e-wallet) with a currency each
- transactions with type: expense | income, amount, currency, account_id, category_id, date, ...
- **Transfers**: a linked pair of transactions sharing a `transferGroupId`. If `transferGroupId` has a value, the transaction is one leg of a transfer. One group holds a maximum of two transactions (out-leg + in-leg).
- **Group transactions**: an expense + income pair sharing a `transactionGroupId`. Solves "I pay $60 for dinner, friend pays back $20" as two linked transactions instead of a splits engine.
- recurring plan template for automatically creating transactions for recurring bills (e.g. Netflix) and recurring income (e.g. monthly salary)
- transactions support file attachments (e.g. receipt photos)

### Schema

Assume system fields (id, created, updated) exist and not repeated in the tables.

#### accounts

Replaces existing `paymentMethods`. Renamed to `accounts` because it now represents where money lives, not how it's paid.


| Field       | Data Type         | Required | Description                                             |
| ----------- | ----------------- | -------- | :------------------------------------------------------ |
| userId      | relation -> users | Yes      |                                                         |
| name        | text              | Yes      | account display name                                    |
| description | text              | No       |                                                         |
| currency    | text              | Yes      | account base currency (ISO 4217 code)                   |
| icon        | text              | No       | display icon                                            |
| color       | text              | No       | display color                                           |
| enabled     | bool              | Yes      | soft delete (transactions keep relation to the account) |

> Balance tracking (initial balance, credit-card billing cycles) is **out of scope for v2.0**. Revisit after v2.

#### transactions

Replaces existing `spentRecords`.


| Field              | Data Type                  | Required | Description                                                                                                          |
| ------------------ | -------------------------- | -------- | :------------------------------------------------------------------------------------------------------------------- |
| userId             | relation -> users          | Yes      |                                                                                                                      |
| type               | select: expense/income     | Yes      | transaction type (no`transfer` type — see `transferGroupId`)                                                        |
| amount             | integer                    | Yes      | transaction amount in**minor units** (see §2)                                                                       |
| currency           | text                       | Yes      | currency of`amount` (ISO 4217 code)                                                                                  |
| accountId          | relation -> accounts       | Yes      | which account this transaction belongs to                                                                            |
| accountAmount      | integer                    | No       | converted snapshot in the**account's** currency, minor units (see §3). Required when `currency` != account currency |
| date               | date                       | Yes      | transaction date. Plain editable`date` (NOT autodate) so records can be backdated or corrected                       |
| categoryId         | relation -> categories     | No       | user defined category. Optional — transfers and pure repayments need no category                                    |
| payeeId            | relation -> payees         | No       | who the money went to / came from                                                                                    |
| transferGroupId    | text                       | No       | if set, this is one leg of a transfer; the other leg shares the same group id. Max 2 transactions per group          |
| transactionGroupId | text                       | No       | if set, links an expense with its reimbursement income ("I pay upfront, friend pays back")                           |
| name               | text                       | No       | free text; could be used for different item names from same payee                                                    |
| description        | text                       | No       |                                                                                                                      |
| recurringPlanId    | relation -> recurringPlans | No       | link the transaction to the recurring plan that generated it                                                         |
| attachments        | file (multiple)            | No       | receipt photos / supporting documents (see note below)                                                                |

Attachments use PocketBase's native file field (stored on disk/S3, served via `/api/files/`), so no separate collection is needed — no attachment metadata worth querying yet. Suggested limits: images + PDF only, ~10 MB each, max 5 per transaction. Client should compress receipt photos before upload. Deleting a transaction deletes its files; files are **not** shared between transactions (e.g. both transfer legs attach their own copy if needed).

Transfer example (move $100 from bank to e-wallet):

- txn A: `type: expense`, `accountId: bank`, `amount: 10000`, `transferGroupId: g1`, `categoryId: null`, `payeeId: null`
- txn B: `type: income`, `accountId: ewallet`, `amount: 10000`, `transferGroupId: g1`, `categoryId: null`, `payeeId: null`

Group transaction example (I pay $60 dinner, friend repays $20):

- txn A: `type: expense`, `amount: 6000`, `categoryId: dining`, `payeeId: restaurant`, `transactionGroupId: g2`
- txn B: `type: income`, `amount: 2000`, `payeeId: friend`, `transactionGroupId: g2`

#### categories

Replaces existing `spentTypes`.


| Field       | Data Type         | Required | Description                                        |
| ----------- | ----------------- | -------- | :------------------------------------------------- |
| userId      | relation -> users | Yes      |                                                    |
| name        | text              | Yes      | category name                                      |
| description | text              | No       |                                                    |
| color       | text              | No       | display color                                      |
| icon        | text              | No       | display icon                                       |
| weight      | integer           | No       | arbitrary display order (drag-sort writes it back) |
| enabled     | bool              | Yes      | soft delete (relation cannot be hard deleted)      |

#### payees

New in v2. Normalizes "who did I pay / who paid me" for analytics and autocomplete.


| Field       | Data Type         | Required | Description                  |
| ----------- | ----------------- | -------- | :--------------------------- |
| userId      | relation -> users | Yes      |                              |
| name        | text              | Yes      | payee name (unique per user) |
| description | text              | No       |                              |
| enabled     | bool              | Yes      | soft delete                  |

Integration with existing `spentRecordNames`: that collection only exists to power autocomplete, keyed per category. In v2:

- `payees.name` provides **global** autocomplete (better for analytics).
- Per-category relevance ranking comes for free by querying recent `transactions` filtered by `categoryId` and grouping by `payeeId` — no separate collection needed.
- Migration (M2): `spentRecordNames` rows become `payees`; recent-usage ordering is rebuilt from the migrated transactions.

#### templates

Replaces existing `spentPresets`. Renamed because it can now also template income.


| Field       | Data Type              | Required | Description                                                   |
| ----------- | ---------------------- | -------- | :------------------------------------------------------------ |
| userId      | relation -> users      | Yes      |                                                               |
| name        | text                   | Yes      | template display name (button label in quick-create)          |
| description | text                   | No       | prefill description                                           |
| type        | select: expense/income | Yes      | transaction type to create                                    |
| amount      | integer                | No       | prefill amount, minor units (empty = prompt at creation time) |
| currency    | text                   | No       | prefill currency (defaults to account currency)               |
| accountId   | relation -> accounts   | No       | prefill account                                               |
| categoryId  | relation -> categories | No       | prefill category                                              |
| payeeId     | relation -> payees     | No       | prefill payee                                                 |
| weight      | integer                | No       | display order on quick-create page                            |
| enabled     | bool                   | Yes      | soft delete                                                   |

Core value: with a fully prefilled template, creating a record is still two taps.

#### recurringPlans

Generalized from existing `subscriptionPlans`: a **generator of transactions** for anything recurring — bills/subscriptions (expense) and salary (income). A "subscription" is just a recurring expense plan.


| Field        | Data Type              | Required | Description                                                                           |
| ------------ | ---------------------- | -------- | :------------------------------------------------------------------------------------ |
| userId       | relation -> users      | Yes      |                                                                                       |
| name         | text                   | Yes      | plan display name (e.g. "Netflix", "Salary")                                          |
| description  | text                   | No       |                                                                                       |
| type         | select: expense/income | Yes      | type of the generated transaction                                                     |
| amount       | integer                | Yes      | amount, minor units                                                                   |
| currency     | text                   | Yes      | currency                                                                              |
| accountId    | relation -> accounts   | Yes      | account the money leaves / arrives in                                                 |
| categoryId   | relation -> categories | Yes      | category for generated transactions (e.g. "Salary" for income plans)                  |
| payeeId      | relation -> payees     | No       | merchant / employer                                                                   |
| rrule        | text                   | Yes      | recurrence rule (RFC 5545 rrule string, e.g.`FREQ=MONTHLY;BYMONTHDAY=25`)             |
| nextDueDate  | date                   | Yes      | next occurrence date; computed by iterating`rrule` from the last occurrence           |
| autoCreate   | bool                   | Yes      | if true, cron materializes the transaction automatically; if false, remind to confirm |
| remindBefore | integer                | No       | days before due date to surface a reminder                                            |
| enabled      | bool                   | Yes      | soft delete / pause                                                                   |

`rrule` replaces a fixed interval select — RFC 5545 covers every realistic cadence (monthly, quarterly, every 4 weeks, 15th and last day of month, etc.). The server parses it with a Go rrule library to compute the next occurrence; the client only needs a friendly preset picker (monthly / yearly / every N weeks / custom) that emits an rrule string, so users never see raw rrule syntax.

`autoCreate` is per-plan because the two directions behave differently: a bill always happens (Netflix charges you → auto-create), but salary can vary or be late (remind → you confirm actual amount/date).

### userSettings

| Field     | Data Type         | Required | Description         |
| --------- | ----------------- | -------- | :------------------ |
| userId    | relation -> users | Yes      |                     |
| colorMode | light / dark      | Yes      | frontend color mode |

_Some field from existing collection is not listed, they are frontend preference and to be added during new client design phase._

## 2. Money representation

Store amounts as **integer minor units** (cents) + ISO 4217 currency code. Never floats — this includes exchange rates (see §3).

## 3. Currency

Amount is stored in original transaction currency (`amount` + `currency`). When it differs from the account's currency, `accountAmount` stores the **converted amount snapshot in minor units of the account currency**, captured at booking time. No exchange-rate floats are stored or used in math; the effective rate is derivable as `accountAmount / amount` if ever needed for display.

## 4. Recurring plans as generators

`recurringPlans` is a template collection. A PocketBase cron hook materializes upcoming occurrences (`nextDueDate <= today` and `autoCreate`) into real `transactions` (with `recurringPlanId` set), then advances `nextDueDate` by iterating the plan's `rrule`. Reminders surface non-auto plans via `remindBefore`; confirming a reminder lets the user adjust the actual amount/date before the transaction is created.

No balance tracking is required for this to be meaningful — analytics aggregate income/expense transactions over periods; recurring income rows feed the same income sums.

## 5. Budgets

What budget mean: aggregation of specific transactions within a specific timeframe

Budget = `{ rules, period, amount }` as a standalone collection; progress computed from `transactions`

`rules` for qualifying transactions to aggregate; `period` defines the timeframe; `amount` is the expense limit

#### budgets


| Field       | Data Type                         | Required | Description                                                                             |
| ----------- | --------------------------------- | -------- | :-------------------------------------------------------------------------------------- |
| userId      | relation -> users                 | Yes      |                                                                                         |
| name        | text                              | Yes      | budget display name (e.g. "Dining", "Monthly essentials")                               |
| amount      | integer                           | Yes      | spending limit, minor units                                                             |
| currency    | text                              | Yes      | budget currency; progress sums`accountAmount` of matching transactions in this currency |
| period      | select: weekly/monthly/yearly     | Yes      | evaluation window                                                                       |
| startDate   | date                              | Yes      | anchor aligning the window (e.g. startDate = 25th → monthly window runs 25th to 24th)  |
| categoryIds | relation -> categories (multiple) | No       | only these categories count; empty = all expense categories                             |
| payeeIds    | relation -> payees (multiple)     | No       | further restrict to these payees; empty = any payee                                     |
| accountIds  | relation -> accounts (multiple)   | No       | further restrict to these accounts; empty = any account                                 |
| enabled     | bool                              | Yes      | soft delete / pause                                                                     |

Rule semantics: **AND across dimensions, OR within a list** — e.g. `{ categoryIds: [dining, groceries] }` = dining OR groceries; `{ categoryIds: [dining], accountIds: [cash] }` = dining paid by cash. `type = expense` is always implied.

A JSON rule engine (arbitrary field conditions, negation, nested logic) is **deliberately deferred** — multi-relations cover realistic personal budgets; revisit only if a concrete need appears.

`period` + `startDate` is used instead of rrule: a budget is an evaluation window, not a recurring event.

Progress is computed server-side (see §6): sum `accountAmount` of matching transactions in the current window. **Cross-currency budgets are an open question** — if matching transactions live in accounts of other currencies, either exclude them or convert at booking rate; decide at M1.

Rollover (unused budget carries to next window) is **out of scope for v2.0**.

**Migration note (M2)**: current `budget_per_month` lives *on* `spentTypes` — each becomes a `budgets` row with `categoryIds: [that category]`, `period: monthly`, `startDate: 1st`. `budgetHistory` is preserved or rebuilt at migration time.

Reimbursement incomes (`transactionGroupId`) is included and a repayment cancels part of the original expense.

Transfers (linked pairs with `transferGroupId`) is excluded from budget/analytics aggregation — moving money isn't spending.

## 6. Analytics views

`spentSumByMonth` / `spentSumByTypeMonth` are originally designed as server side aggregation for mobile so that calculating spending sum doesn't pull every transaction to client. (there was no custom backend, only the stock Pocketbase binary)

v2 gain a real backend. Analytics can be done with server side logic and query, no more hardcoded SQL view.

Drop `spentSumByMonth` / `spentSumByTypeMonth` and design a replacement API.
