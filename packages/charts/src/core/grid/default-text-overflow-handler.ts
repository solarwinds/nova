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

import { BaseType } from "d3";
import { Selection } from "d3-selection";

import { IGNORE_INTERACTION_CLASS } from "../../constants";
import { ITextOverflowArgs } from "./types";

/**
 * Default handler for text overflow
 *
 * @param textSelection
 * @param args
 */
export function defaultTextOverflowHandler(
    textSelection: Selection<BaseType, unknown, null, undefined>,
    args: ITextOverflowArgs
): void {
    const originalText = textSelection.text();
    const chars = originalText.split("");
    // add IGNORE_INTERACTION_CLASS so that mouse events used for displaying the title don't propagate from the mouse-interactive-area
    const ellipsisTSpan = textSelection
        .text("")
        .append("tspan")
        .attr("class", `${IGNORE_INTERACTION_CLASS} ellipsis`)
        .text("...");
    const textTSpan = textSelection
        .insert("tspan", ":first-child")
        .attr("class", `${IGNORE_INTERACTION_CLASS} text`)
        .text(originalText);

    const paddingAndEllipsisWidth =
        args.ellipsisWidth + args.horizontalPadding * 2;
    const originalCharCount = chars.length;
    let labelWidth =
        (textTSpan?.node()?.getComputedTextLength() || 0) +
        args.horizontalPadding * 2;
    while (
        chars.length &&
        (labelWidth > args.widthLimit || chars[chars.length - 1] === " ")
    ) {
        chars.pop();
        textTSpan.text(chars.join(""));
        labelWidth =
            paddingAndEllipsisWidth +
            (textTSpan?.node()?.getComputedTextLength() || 0);
    }

    if (chars.length === originalCharCount) {
        ellipsisTSpan.remove();
    }
}
