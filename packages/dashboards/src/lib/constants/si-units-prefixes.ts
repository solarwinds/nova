// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

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
        prefix: "k",
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
