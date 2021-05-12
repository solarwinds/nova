export interface ISiUnitsPrefix {
    power: number;
    prefix: string;
    label: string;
}

export const SI_UNITS_PREFIXES: ISiUnitsPrefix[] = [
    {
        power: 1,
        prefix: "",
        label: "",
    },
    {
        power: 3,
        prefix: "K",
        label: "kilo",
    },
    {
        power: 6,
        prefix: "M",
        label: "mega",
    },
    {
        power: 9,
        prefix: "G",
        label: "giga",
    },
    {
        power: 12,
        prefix: "T",
        label: "tera",
    },
    {
        power: 15,
        prefix: "P",
        label: "peta",
    },
    {
        power: 18,
        prefix: "E",
        label: "exa",
    },
    {
        power: 21,
        prefix: "Z",
        label: "zetta",
    },
    {
        power: 24,
        prefix: "Y",
        label: "yotta",
    },
];
export const SI_UNITS_PREFIXES_NEGATIVE: ISiUnitsPrefix[] = [
    {
        power: -24,
        prefix: "y",
        label: "yocto",
    },
    {
        power: -21,
        prefix: "z",
        label: "zepto",
    },
    {
        power: -18,
        prefix: "a",
        label: "atto",
    },
    {
        power: -15,
        prefix: "f",
        label: "femto",
    },
    {
        power: -12,
        prefix: "p",
        label: "pico",
    },
    {
        power: -9,
        prefix: "n",
        label: "nano",
    },
    {
        power: -6,
        prefix: "µ",
        label: "micro",
    },
    {
        power: -3,
        prefix: "m",
        label: "milli",
    },
    {
        power: 1,
        prefix: "",
        label: "",
    },
];
