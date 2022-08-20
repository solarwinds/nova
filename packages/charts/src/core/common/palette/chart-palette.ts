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
