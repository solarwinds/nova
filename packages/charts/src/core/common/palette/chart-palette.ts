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

import { rgb } from "d3-color";
import isArray from "lodash/isArray";

import { IChartPalette, IValueProvider } from "../types";
import { getColorValueByName } from "./color.helper";
import { ProcessedColorProvider } from "./processed-color-provider";
import { SequentialColorProvider } from "./sequential-color-provider";
import { TextColorProvider } from "./text-color-provider";

export class ChartPalette implements IChartPalette {
    private _standardColors: IValueProvider<string>;
    private _textColors: TextColorProvider;
    private _backgroundColors: IValueProvider<string>;

    constructor(
        colors: string[] | IValueProvider<string>,
        options = { backgroundOpacity: 0.15 }
    ) {
        if (isArray(colors)) {
            this._standardColors = new SequentialColorProvider(
                <string[]>colors
            );
        } else {
            this._standardColors = <IValueProvider<string>>colors;
        }
        this._textColors = new TextColorProvider(this.standardColors, {
            light: "white",
            dark: "black",
        }); // TODO: oops!
        this._backgroundColors = new ProcessedColorProvider(
            this.standardColors,
            (c: string) => {
                const color = getColorValueByName(c);
                const rgbColor = rgb(color);
                rgbColor.opacity = options.backgroundOpacity;
                return rgbColor.toString();
            }
        );
    }

    public get standardColors(): IValueProvider<string> {
        return this._standardColors;
    }

    public get backgroundColors(): IValueProvider<string> {
        return this._backgroundColors;
    }

    public get textColors(): IValueProvider<string> {
        return this._textColors;
    }
}
