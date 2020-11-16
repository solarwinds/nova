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
export function defaultTextOverflowHandler(textSelection: Selection<BaseType, unknown, null, undefined>, args: ITextOverflowArgs): void {
    const originalText = textSelection.text();
    const chars = originalText.split("");
    // add IGNORE_INTERACTION_CLASS so that mouse events used for displaying the title don't propagate from the mouse-interactive-area
    const ellipsisTSpan = textSelection.text("").append("tspan").attr("class", `${IGNORE_INTERACTION_CLASS} ellipsis`).text("...");
    const textTSpan = textSelection.insert("tspan", ":first-child").attr("class", `${IGNORE_INTERACTION_CLASS} text`).text(originalText);

    const paddingAndEllipsisWidth = args.ellipsisWidth + args.horizontalPadding * 2;
    const originalCharCount = chars.length;
    let labelWidth = (textTSpan?.node()?.getComputedTextLength() || 0) + args.horizontalPadding * 2;
    while (chars.length && (labelWidth > args.widthLimit || chars[chars.length - 1] === " ")) {
        chars.pop();
        textTSpan.text(chars.join(""));
        labelWidth = paddingAndEllipsisWidth + (textTSpan?.node()?.getComputedTextLength() || 0);
    }

    if (chars.length === originalCharCount) {
        ellipsisTSpan.remove();
    }
}
