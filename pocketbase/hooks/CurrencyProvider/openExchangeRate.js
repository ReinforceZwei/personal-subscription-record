

const definition = {
    apiCanUse: !!process.env.SSRS_OPEN_EXCHANGE_RATE_API_KEY,
    source: "openexchangerates.org",
    latest: {
        endpoint: "https://openexchangerates.org/api/latest.json",
        queryParams: {
            app_id: process.env.SSRS_OPEN_EXCHANGE_RATE_API_KEY,
        },
        transformResult: (rawBody) => {
            return JSON.parse(rawBody)
        },
    },
    historical: {
        endpoint: (date) => {
            let pad = v => `0${v}`.slice(-2)
            let datestring = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
            return `https://openexchangerates.org/api/historical/${datestring}.json`
        },
        queryParams: (date) => ({
            app_id: process.env.SSRS_OPEN_EXCHANGE_RATE_API_KEY,
        }),
        transformResult: (rawBody) => {
            return JSON.parse(rawBody)
        },
    }
}

module.exports = definition