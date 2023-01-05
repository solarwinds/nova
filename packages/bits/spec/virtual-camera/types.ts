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

export interface PercyLensSnapshotOptions {
    widths?: number[];
    minHeight?: number;
    percyCSS?: string;
    enableJavaScript?: boolean;
}

export enum LensType {
    /** @deprecated Eyes is not supported anymore */
    Eyes = "eyes",
    Percy = "percy",
}

export const LENSES: string[] = [...Object.values(LensType)];

export const CAMERA_DEFAULT_SETTINGS: ICameraSettings = {
    fullframe: true,
    responsiveWidths: [1920],
    currentSuiteName: "",
    currentTestName: "",
    globalLens: "percy",
    responsivityCallback: undefined,
};

export const PERCY_DEFAULT_CONFIG: PercyLensSnapshotOptions = {
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
};
export interface ILens {
    takeSnapshot(label: string): Promise<void>;
    takeFullScreenSnapshot(label: string): Promise<void>;
    cameraON(): Promise<void>;
    cameraOFF(): Promise<void>;
    toolConfig(): any;
}

export interface ICameraSettings {
    fullframe: boolean;
    responsiveWidths: number[];
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
