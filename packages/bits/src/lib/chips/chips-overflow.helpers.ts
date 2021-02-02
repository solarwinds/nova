/*
export function toFixed(num: number, fixed: number): number {
    const ceil = +(String(1).padEnd(fixed, "0"));
    return Math.ceil((num + Number.EPSILON) * ceil) / ceil;
}

export function toFixedSum(operands: number[], fixed: number): number {
    return operands.reduce((acc: number, current: number) =>
        toFixed(toFixed(acc, fixed) + toFixed(current, fixed), fixed), 0);
}
*/
