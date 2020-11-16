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
}

export interface IKpiConfiguration {
    interactive: boolean;
}
