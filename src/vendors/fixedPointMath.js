const precision = 1000

export function sumBy(a, selector = (x) => x) {
    return a.reduce((p, c) => p += selector(c) * precision, 0) / precision
}

export function subtract(a, b) {
    return (a * precision - b * precision) / precision
}