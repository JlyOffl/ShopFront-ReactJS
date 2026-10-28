/** Round to 2 decimal places without the classic 1.005 floating point surprise. */
export const round2 = (value: number): number => Math.round((value + Number.EPSILON) * 100) / 100;

/** Removes floating point noise such as 20 - 19.8 = 0.1999999999999993. */
export const normalise = (value: number): number => parseFloat(value.toPrecision(10));
