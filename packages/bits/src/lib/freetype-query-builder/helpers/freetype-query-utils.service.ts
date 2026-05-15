// © 2023 SolarWinds Worldwide, LLC. All rights reserved.
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

import { Inject, Injectable } from "@angular/core";

import { WindowToken } from "./window";
import { CaretCoordinates } from "../models";

const properties = [
    "boxSizing",
    "width",
    "height",
    "overflowX",
    "overflowY",

    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",

    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",

    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontStretch",
    "fontSize",
    "lineHeight",
    "fontFamily",

    "textAlign",
    "textTransform",
    "textIndent",
    "textDecoration",

    "letterSpacing",
    "wordSpacing",
];

type OurCSS = CSSStyleDeclaration & { [key: string]: any };

@Injectable()
export class FreeTypeQueryUtilsService {
    private window: Window;
    constructor(@Inject(WindowToken) window: any) {
        this.window = window as Window;
    }

    getTextareaCaretCoordinates(
        element: HTMLTextAreaElement,
        position: number
    ): CaretCoordinates {
        const isFirefox: boolean = !(
            (this.window as any).mozInnerScreenX == null
        );

        let mirrorDiv = this.window.document.getElementById(
            element.nodeName + "--mirror-div"
        );
        if (!mirrorDiv) {
            mirrorDiv = this.window.document.createElement("div");
            mirrorDiv.id = element.nodeName + "--mirror-div";
            this.window.document.body.appendChild(mirrorDiv);
        }

        const style: OurCSS = mirrorDiv.style;
        const computed: OurCSS = getComputedStyle(element);

        style.whiteSpace = "pre-wrap";
        style.position = "absolute";
        style.top =
            element.offsetTop + parseInt(computed.borderTopWidth, 10) + "px";
        style.left = "-400px";

        properties.forEach((prop) => {
            style[prop as keyof typeof CSSStyleDeclaration] = computed[prop];
        });

        if (isFirefox) {
            style.width = parseInt(computed.width, 10) - 2 + "px";
            // Firefox adds 2 pixels to the padding - https://bugzilla.mozilla.org/show_bug.cgi?id=753662
            // Firefox lies about the overflow property for textareas:
            // https://bugzilla.mozilla.org/show_bug.cgi?id=984275
            if (element.scrollHeight > parseInt(computed.height, 10)) {
                style.overflowY = "scroll";
            }
        } else {
            style.overflow = "hidden";
        }

        mirrorDiv.textContent = element.value.substring(0, position);
        const span = this.window.document.createElement("span");
        span.textContent = element.value.substring(position) || ".";
        span.style.backgroundColor = "lightgrey";
        mirrorDiv.appendChild(span);

        const scrollTop = element.scrollTop;
        const coordinates = {
            top:
                span.offsetTop +
                parseInt(computed["borderTopWidth"], 10) -
                scrollTop,
            left: span.offsetLeft + parseInt(computed["borderLeftWidth"], 10),
            scrollTop,
        };
        this.window.document.body.removeChild(mirrorDiv);

        return coordinates;
    }
}
