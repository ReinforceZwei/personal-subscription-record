const precision = 1000

export function sumBy(a: any[], selector: (x: any) => number) {
    return a.reduce((p, c) => p += selector(c) * precision, 0) / precision
}

export function add(a: number, b: number) {
    return (a * precision + b * precision) / precision
}

export function subtract(a: number, b: number) {
    return (a * precision - b * precision) / precision
}