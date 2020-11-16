export interface IFormatterData<T = any> {
    value: T;
    [key: string]: any;
}

export interface ILinkFormatterData extends IFormatterData<string> {
    link: string;
}
