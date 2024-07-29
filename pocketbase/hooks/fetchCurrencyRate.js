function fetchLatestCurrency(definitionSet) {
    let definition = definitionSet.latest
    let queryString = (typeof definition.queryParams === 'function') ? definition.queryParams() : definition.queryParams
    let url = (typeof definition.endpoint === 'function') ? definition.endpoint() : definition.endpoint
    //let query = new URLSearchParams(queryString)
    let esc = encodeURIComponent;
    let query = Object.keys(queryString)
        .map(k => esc(k) + '=' + esc(queryString[k]))
        .join('&')
    if (query) {
        url = `${url}?${query}`
    }
    let config = {
        url: url,
        method: 'get',
    }
    let resp = $http.send(config)
    if (resp.statusCode >= 200 && resp.statusCode <= 299) {
        let result = definition.transformResult(resp.raw)
        return {
            base: result.base,
            rates: result.rates,
            source: definitionSet.source,
        }
    }
}

function fetchHistoricalCurrency(definitionSet, date) {
    let definition = definitionSet.historical
    let queryString = (typeof definition.queryParams === 'function') ? definition.queryParams(date) : definition.queryParams
    let url = (typeof definition.endpoint === 'function') ? definition.endpoint(date) : definition.endpoint
    //let query = new URLSearchParams(queryString)
    let esc = encodeURIComponent;
    let query = Object.keys(queryString)
        .map(k => esc(k) + '=' + esc(queryString[k]))
        .join('&')
    if (query) {
        url = `${url}?${query}`
    }
    let config = {
        url: url,
        method: 'get',
    }
    let resp = $http.send(config)
    if (resp.statusCode >= 200 && resp.statusCode <= 299) {
        let result = definition.transformResult(resp.raw)
        return {
            base: result.base,
            rates: result.rates,
            source: definitionSet.source,
        }
    }
}

module.exports = {
    fetchLatestCurrency,
    fetchHistoricalCurrency,
}