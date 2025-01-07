import { DateTime } from "luxon"

type Rates = { [key: string]: number }

export interface CurrencyRate {
    date: string
    base: string
    rates: Rates
}

export async function fetchLatestCurrency(): Promise<{ base: string; rates: Rates }> {
    const base = 'usd'
    const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${base}.min.json`
    const fallback = `https://latest.currency-api.pages.dev/v1/currencies/${base}.min.json`
    try {
        const result = await fetch(url)
            .then(res => res.json())
        return {
            base,
            rates: result[base],
        }
    } catch (error) {
        const result = await fetch(fallback)
            .then(res => res.json())
        return {
            base,
            rates: result[base],
        }
    }
}



/**
 * Get currency rate with caching
 * @returns Currency object
 */
export async function getCurrencyRate(): Promise<CurrencyRate> {
    const currencyCache = localStorage.getItem('currency')
    if (currencyCache !== null) {
        const rates = JSON.parse(currencyCache) as CurrencyRate
        if (DateTime.fromISO(rates.date).plus({ day: 2 }) > DateTime.now().toUTC()) {
            return rates
        }
    }

    const currency = await fetchLatestCurrency()
    const rates = {
        ...currency,
        date: DateTime.now().toUTC().toISO(),
    }
    localStorage.setItem('currency', JSON.stringify(rates))
    return rates
}

export function clearCurrencyCache() {
    localStorage.removeItem('currency')
}