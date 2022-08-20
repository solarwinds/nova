import { Moment } from "moment/moment";

export interface IQuickPickPreset {
    name: string;
}

export interface ITimeFramePreset extends IQuickPickPreset {
    name: string;
    startDatetimePattern: any;
    endDatetimePattern: any;
}

export interface ITimeFramePresetDictionary {
    [key: string]: ITimeFramePreset;
}

export interface IQuickPickPresetDictionary {
    [key: string]: IQuickPickPreset;
}

export interface ITimeframe {
    startDatetime: Moment;
    endDatetime: Moment;
    selectedPresetId?: string;
    title?: string;
}
