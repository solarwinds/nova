export enum TimeUnit {
    Second = "second",
    Minute = "minute",
    Hour = "hour",
}

export const TIME_UNITS_TO_MS = {
    [TimeUnit.Second]: 1000,
    [TimeUnit.Minute]: 60000,
    [TimeUnit.Hour]: 3600000,
};

export const TIME_UNITS_LONG = {
    [TimeUnit.Hour]: $localize`:hours unit (long):hours`,
    [TimeUnit.Minute]: $localize`:minutes unit (long):minutes`,
    [TimeUnit.Second]: $localize`:seconds unit (long):seconds`,
};

export const TIME_UNITS_SHORT = {
    [TimeUnit.Hour]: $localize`:hours unit (short):h`,
    [TimeUnit.Minute]: $localize`:minutes unit (short):min`,
    [TimeUnit.Second]: $localize`:seconds unit (short):sec`,
};


export function getTimeUnitsRatio(fromUnit: TimeUnit, toUnit: TimeUnit) {
    return TIME_UNITS_TO_MS[fromUnit] / TIME_UNITS_TO_MS[toUnit];
}
