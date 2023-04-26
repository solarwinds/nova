export interface QueryToken {
    value: string;
    start: number;
    end: number;
    focused?: boolean;
}

export interface ElementPadding {
    top: number;
    bottom: number;
    left: number;
    right: number;
}

export interface BaseCoordinates {
    left: number;
    top: number;
}

export interface ColorsConf {
    notif: string;
    highlight: HighlightColor;
}

export enum HighlightColor {
    COL_1 = "#a6dbf8",
    COL_2 = "rgba(0, 196, 210, 0.5)",
    COL_3 = "#ffa6df",
    COL_4 = "#e3e3e3",
}

export enum NotifColor {
    error = "red",
    info = "lightblue",
    warning = "#ffe11d",
}

export interface RenderConfigurator<T> {
    getNotifColor(token: T): string;

    getHighlightColor(token: T): HighlightColor;

    enhanceTokens?(tokens: T[]): T[];
}

export interface HintEntry {
    displayValue: string;
    value: string;
    icon?: string;
}

export type HelpEntry = HelpEntryCategory | HintEntry;

export interface HelpEntryCategory {
    notice?: boolean;
    header?: string;
    items?: any[];
}

export interface Tokenizer<T extends QueryToken> {
    tokenizeText(text: string, baseIdx?: number): T[];
}
export interface CaretCoordinates {
    top: number;
    left: number;
    scrollTop: number;
}
