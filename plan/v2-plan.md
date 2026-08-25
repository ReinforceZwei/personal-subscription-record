# v2 refactor

many pain points after using this app for 2 years

# what problem is this app trying to solve? (primary goal)

track where is my money spent with least effort

biggest blocker: banks doesnt open their data to personal customer

# how this app solving problem **now**?

require manual input, but make it effortless

happiest case: with preset (template), only takes two tap to create a record

## Pain Points

### Core feature

- financial domain model is messy/incomplete/non-standard
  - what is "name"? "price"? "type"?
- only tracks expenditure, doesnt track income
- cannot handle complex transaction/scenario
  - e.g. I pay upfront, my friend pay back me later
  - tranfer money between my accounts
- no proper currency support
- subscription/bill is dangling, doesnt integrate with transaction, no automation
- budget design is not useful
  - only as a reminder "how much i can spend on this month"

### UI

- cannot search transaction
- no dashboard, no analyze tool, no query

## New feature I want

- custom dashboard
- AI agent
  - answer question e.g. avg spending on XXX in last 6 months?
  - build dashboard
- utility tools, easy to add new
  - e.g. Interest Calculator
- automation rule

## Technical facing

this react project is where i start learning react. they are anti-patterns. and i have shifted to Mantine + Tanstack router/query. [this project](https://github.com/ReinforceZwei/anime-list-next) is a better example.

spin up a brand new Vite project. Keep the old client running alongside as a reference point.

backend will keep using pocketbase as framework.

data model/schema is expected to have changes. need to provide data migration path for existing deployment.