import { Injectable } from "@angular/core";
import isNil from "lodash/isNil";

import { HTML_COLORS } from "./HTMLcolors";

@Injectable()
export class ColorService {

    public RGBToHexRGBToHex(rgbColor: string): string {
        // Choose correct separator
        const sep = rgbColor.indexOf(",") > -1 ? "," : " ";
        // Turn "rgb(r,g,b)" into [r,g,b]
        const rgbParts = rgbColor.substr(4).split(")")[0].split(sep);
      
        let r = (+rgbParts[0]).toString(16),
            g = (+rgbParts[1]).toString(16),
            b = (+rgbParts[2]).toString(16);
      
        if (r.length === 1) {
            r = "0" + r;
        }
        if (g.length === 1) {
            g = "0" + g;
        }
        if (b.length === 1) {
            b = "0" + b;
        }
      
        return "#" + r + g + b;
    }

    public isHEX(hexColor: string): boolean {
        return /^#[0-9A-F]{6}$/i.test(hexColor) || /^#([0-9A-F]{3}){1,2}$/i.test(hexColor);
    }

    public colorKeywordsToHex(color: string): string {
        const hexOfColor = HTML_COLORS.get(color);

        return !isNil(hexOfColor) ? hexOfColor : "";
    }
}
