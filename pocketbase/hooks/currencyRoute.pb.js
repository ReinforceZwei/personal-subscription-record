routerAdd("GET", "/hello/:name", (c) => {
    let name = c.pathParam("name")

    //process.env.TZ
    let openexchangerates = require(`${__hooks}/CurrencyProvider/openExchangeRate`)
    let { fetchLatestCurrency } = require(`${__hooks}/fetchCurrencyRate`)
    let result = fetchLatestCurrency(openexchangerates)

    const collection = $app.dao().findCollectionByNameOrId("currencyRate")

    const record = new Record(collection, result)

    // or load individual fields separately
    //record.set("someOtherField", 123)

    $app.dao().saveRecord(record)

    return c.json(200, { "message": result })
})