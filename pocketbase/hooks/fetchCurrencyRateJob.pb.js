/// <reference path="../../../pb_data/types.d.ts" />

cronAdd('fetch_currency_daily', '0 0 * * *', () => {
    let { fetchLatestCurrency } = require(`${__hooks}/fetchCurrencyRate`)
    let openexchangerates = require(`${__hooks}/CurrencyProvider/openExchangeRate`)

    if (openexchangerates.apiCanUse) {
        try {
            let result = fetchLatestCurrency(openexchangerates)
            const collection = $app.dao().findCollectionByNameOrId("currencyRate")
            const record = new Record(collection, result)
            $app.dao().saveRecord(record)
            $app.logger().info('Currency rate updated into collection', 'source', result.souce)
        } catch (error) {
            $app.logger().error('Currency rate update failed', 'source', result.souce, 'error', error)
        }
    }
})


onAfterBootstrap((e) => {
    const records = $app.dao().findRecordsByFilter(
        "currencyRate",
        "created > {:date}",
        "-created",
        10,
        0,
        { date: new Date(new Date().setDate(new Date().getDate() - 1)) },
    )

    if (!records.length) {
        let { fetchLatestCurrency } = require(`${__hooks}/fetchCurrencyRate`)
        let openexchangerates = require(`${__hooks}/CurrencyProvider/openExchangeRate`)

        if (openexchangerates.apiCanUse) {
            try {
                let result = fetchLatestCurrency(openexchangerates)
                const collection = $app.dao().findCollectionByNameOrId("currencyRate")
                const record = new Record(collection, result)
                $app.dao().saveRecord(record)
                $app.logger().info('Currency rate updated into collection', 'source', result.source)
            } catch (error) {
                $app.logger().error('Currency rate update failed', 'source', result.source, 'error', error)
            }
        }
    }
})