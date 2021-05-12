import { InjectionToken } from "@angular/core";

export const unitConversionToken = new InjectionToken<IUnitConversionConstants>("unit-conversion.constant");

export interface IUnitConversionConstants {
    generic: string[];
    bytes: string[];
    bytesPerSecond: string[];
    bitsPerSecond: string[];
    hertz: string[];
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
    bytesPerSecond: ["Bps", "kBps", "MBps", "GBps", "TBps", "PBps", "EBps", "ZBps", "YBps"],
    bitsPerSecond: ["bps", "kbps", "Mbps", "Gpbs", "Tbps", "Pbps", "Ebps", "Zbps", "Ybps"],
    hertz: ["Hz", "kHz", "MHz", "GHz", "THz", "PHz", "EHz", "ZHz", "YHz"],
};

/** Available options for unit conversion */
export type UnitOption = "generic" | "bytes" | "bytesPerSecond" | "bitsPerSecond" | "hertz";
