import { SnapshotOptions } from "@percy/core";

export enum LensType {
    Eyes = "eyes",
    Percy = "percy"
}

export const LENSES: string[] =  [ ...Object.values(LensType) ];

export const CAMERA_DEFAULT_SETTINGS: ICameraSettings = {
    fullframe: true,
    responsiveWiths: [1920],
    currentSuiteName: "",
    currentTestName: "",
    globalLens: "percy",
    responsivityCallback: undefined,
}

export const PERCY_DEFAULT_CONFIG: SnapshotOptions = {
    widths: [1920],
    minHeight: 1080,
    percyCSS: `
        input, textarea { 
            caret-color: transparent;
        }
        * {
            cursor: none !important;
        }
    `,
}
export interface ILens {
    takeSnapshot(label: string): Promise<void>;
    takeFullScreenSnapshot(label: string): Promise<void>;
    cameraON(): Promise<void>;
    cameraOFF(): Promise<void>;
    toolConfig(): any;
}

export interface ICameraSettings {
    fullframe: boolean;
    responsiveWiths: number[];
    currentSuiteName: string;
    currentTestName: string;
    globalLens: string;
    responsivityCallback: Function | undefined;
}

export interface ICameraSettingsActions {
    fullframe(): Promise<void>;
    crop(): Promise<void>;
    responsive(values: Array<number>, callback?: Function): Promise<void>;
    defaultResponsive(): Promise<void>;
}
