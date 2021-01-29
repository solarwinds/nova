export function toFixed(num: number, fixed: number): number {
    const re = new RegExp("^-?\\d+(?:\.\\d{0," + (fixed || -1) + "})?");
    return +(num.toString().match(re) as RegExpMatchArray)[0];
}

export function toFixedSum(operands: number[], rounding = 2): number {
    return operands.reduce((acc: number, current: number) =>
        toFixed(toFixed(acc, rounding) + toFixed(current, rounding), rounding), 0);
}
