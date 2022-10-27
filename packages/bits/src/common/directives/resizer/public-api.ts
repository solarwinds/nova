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

/** @ignore */
export enum ResizeDirection {
    left = "left",
    right = "right",
    top = "top",
    bottom = "bottom",
}
/** @ignore */
export enum ResizeUnit {
    percent = "%",
    pixel = "px",
}
/** @ignore */
export interface IResizeProperties {
    appendDirection: "left" | "right" | "top" | "bottom";
    borderToCalculate: "left" | "right" | "top" | "bottom";
    cursor: "ew-resize" | "ns-resize";
    sizeToSet: "width" | "height";
    otherSizeProperty: "width" | "height";
    nativeElementSizeProperty: "offsetHeight" | "offsetWidth";
}
/** @ignore */
export const resizeDirectionHelpers: { [key: string]: IResizeProperties } = {
    right: {
        appendDirection: "left",
        borderToCalculate: "right",
        cursor: "ew-resize",
        sizeToSet: "width",
        otherSizeProperty: "height",
        nativeElementSizeProperty: "offsetWidth",
    },
    left: {
        appendDirection: "right",
        borderToCalculate: "left",
        cursor: "ew-resize",
        sizeToSet: "width",
        otherSizeProperty: "height",
        nativeElementSizeProperty: "offsetWidth",
    },
    top: {
        appendDirection: "bottom",
        borderToCalculate: "top",
        cursor: "ns-resize",
        sizeToSet: "height",
        otherSizeProperty: "width",
        nativeElementSizeProperty: "offsetHeight",
    },
    bottom: {
        appendDirection: "top",
        borderToCalculate: "bottom",
        cursor: "ns-resize",
        sizeToSet: "height",
        otherSizeProperty: "width",
        nativeElementSizeProperty: "offsetHeight",
    },
};
