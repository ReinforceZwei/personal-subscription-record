# Domain model

## 1. transaction model

- accounts (bank, cash, credit card, e-wallet) with a currency each
- transactions with type: expense | income | transfer, amount, currency, account_id, category_id, date, ...
- transaction_splits (optional legs: "friend owes me $20 of this $60 dinner" → a receivable; their repayment later is a transaction against it)
- Transfers = a linked pair

### Schema

Assume system fields (id, created, updated) exist.

#### accounts

replace existing `paymentMethods`


| Field       | Data Type         | Required | Description           |
| ----------- | ----------------- | -------- | :-------------------- |
| userId      | relation -> users | Yes      |                       |
| name        | text              | Yes      | account display name  |
| description | text              | No       |                       |
| currency    | text              | Yes      | account base currency |

#### transactions

replace existing `spentRecords`


| Field        | Data Type                   | Required | Description                                                                                     |
| ------------ | --------------------------- | -------- | :---------------------------------------------------------------------------------------------- |
| userId       | relation -> users           | Yes      |                                                                                                 |
| type         | expense / income / transfer | Yes      | transaction type                                                                                |
| amount       | integer                     | Yes      | transaction amount                                                                              |
| accountId    | relation -> accounts        | Yes      | which account made this transaction                                                             |
| currency     | text                        | Yes      | transaction amount currency                                                                     |
| exchangeRate | float                       | No       | snapshot of currency exchange rate when transaction currency is different from account currency |
| date         | autodate (on create)        | Yes      | transaction date, allow override on create                                                      |
| transferId   | relation -> transactions    | No       | point to linked transaction when type is transfer                                               |
| categoryId   | relation -> categories      | Yes      | user defined category                                                                           |
| payeeId      | relation -> payees          | No       | paying to who                                                                                   |
| name         | text                        | Yes      |                                                                                                 |
| description  | text                        | No       |                                                                                                 |

#### categories

replace existing `spentTypes`


| Field   | Data Type         | Required | Description                                   |
| ------- | ----------------- | -------- | :-------------------------------------------- |
| userId  | relation -> users | Yes      |                                               |
| name    | text              | Yes      | category name                                 |
| color   | text              | No       | display color                                 |
| enabled | bool              | No       | soft delete (relation cannot be hard deleted) |

current app use `weight` for arbitrary order. keep it or have better implementation?

#### payees

not exist in current app. should we introduce payee model? any benefits?

## 2. Money representation

store amounts as integer minor units + currency code, never floats

## 3. Currency

amount in original currency + converted amount snapshot at booking time

## 4. Subscriptions as generators

`subscriptionPlans` stays as a template collection, but add automation: a PocketBase cron hook that materializes upcoming charges into real transactions

## 5. Budgets

Redesign after transactions exist. 

transfers don't touch budgets/analytics