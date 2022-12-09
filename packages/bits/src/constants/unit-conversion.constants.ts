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

import { InjectionToken } from "@angular/core";

export const unitConversionToken = new InjectionToken<IUnitConversionConstants>(
    "unit-conversion.constant"
);

export interface IUnitConversionConstants {
    generic: string[];
    bytes: string[];
    bytesPerSecond: string[];
    bitsPerSecond: string[];
    hertz: string[];
    percent: string[];
}

/** Standard base values used in unit conversion */
export enum UnitBase {
    Standard = 1000,
    Bytes = 1024,
}

/**
 * Unit display values used in unit conversion
 */
export const unitConversionConstants: IUnitConversionConstants = {
    generic: ["", "K", "M", "B", "T", "Qa", "Qi", "Sx", "Sp"],
    bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    bytesPerSecond: [
        "Bps",
        "kBps",
        "MBps",
        "GBps",
        "TBps",
        "PBps",
        "EBps",
        "ZBps",
        "YBps",
    ],
    bitsPerSecond: [
        "bps",
        "kbps",
        "Mbps",
        "Gbps",
        "Tbps",
        "Pbps",
        "Ebps",
        "Zbps",
        "Ybps",
    ],
    hertz: ["Hz", "kHz", "MHz", "GHz", "THz", "PHz", "EHz", "ZHz", "YHz"],
    percent: ["%"],
};

/** Available options for unit conversion */
export type UnitOption =
    | "generic"
    | "bytes"
    | "bytesPerSecond"
    | "bitsPerSecond"
    | "hertz"
    | "percent";
