import { InjectionToken } from "@angular/core";

export const unitConversionToken = new InjectionToken<IUnitConversionConstants>("unit-conversion.constant");

export interface IUnitConversionConstants {
    generic: string[];
    bytes: string[];
    bytesPerSecond: string[];
    bitsPerSecond: string[];
    hertz: string[];
}

export const unitConversionConstants: IUnitConversionConstants = {
    generic: ["", "k", "M", "B", "Qa", "Qi", "Sx", "Sp", "Oc"],
    bytes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    bytesPerSecond: ["Bps", "kBps", "MBps", "GBps", "TBps", "PBps", "EBps", "ZBps", "YBps"],
    bitsPerSecond: ["bps", "kbps", "Mbps", "Gpbs", "Tbps", "Pbps", "Ebps", "Zbps", "Ybps"],
    hertz: ["Hz", "kHz", "MHz", "GHz", "THz", "PHz", "EHz", "ZHz", "YHz"],
};

export type UnitOption = "generic" | "bytes" | "bytesPerSecond" | "bitsPerSecond" | "hertz";
