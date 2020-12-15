import { IFormatter } from "../types";

export enum KpiFormatterTypes {
    // ROOT ?
    Value = "Value",
}

export interface IKpiData {
    id?: string;
    value?: any;
    units?: string;
    label?: string;
    backgroundColor?: string;
    textColor?: string;
    fontSize?: string;
    numberFormat?: string;
    link?: string;
    [key: string]: any;
}

export interface IKpiConfiguration {
    interactive?: boolean;
    formatters?: IKpiFormattersConfiguration;
}

export interface IKpiFormattersConfiguration extends Partial<Record<KpiFormatterTypes | string, {
    formatter: IFormatter,
}>> {}
export interface IKpiFormatterProperties extends Partial<Record<KpiFormatterTypes | string, any>> {}
