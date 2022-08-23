import { select, Selection } from "d3-selection";

import { IGNORE_INTERACTION_CLASS } from "../../constants";
import { defaultTextOverflowHandler } from "./default-text-overflow-handler";

describe("defaultTextOverflowHandler", () => {
    let root: HTMLElement;
    let group: Selection<SVGGElement, unknown, null, undefined>;
    let textElement: Selection<SVGTextElement, unknown, null, undefined>;
    let ellipsisWidth: number;
    let textWidth: number;

    beforeEach(() => {
        root = document.createElement("div");
        document.body.appendChild(root);

        group = select(root).append("svg").append("g");
        textElement = group.append("text");

        const ellipsisTSpan = select(group.node())
            .select("text")
            .append("tspan")
            .text("...");
        ellipsisWidth = ellipsisTSpan?.node()?.getComputedTextLength() || 0;
        ellipsisTSpan.remove();

        const textTSpan = select(group.node())
            .select("text")
            .append("tspan")
            .text("testText");
        textWidth = textTSpan?.node()?.getComputedTextLength() || 0;
        textTSpan.remove();
    });

    afterEach(() => {
        document.body.removeChild(root);
    });

    it("should truncate text that's longer than the available width", () => {
        select(group.node()).select("text").text("testText");
        const args = {
            widthLimit: textWidth / 2,
            horizontalPadding: 0,
            ellipsisWidth,
        };

        select(group.node())
            .select("text")
            .call(defaultTextOverflowHandler, args);

        expect(textElement.node()?.getComputedTextLength()).toBeLessThan(
            textWidth / 2
        );
        expect(textElement.select(".ellipsis").text()).toEqual("...");
    });

    it("should not truncate text that's shorter than the available width", () => {
        select(group.node()).select("text").text("testText");
        const args = {
            widthLimit: textWidth + 50,
            horizontalPadding: 0,
            ellipsisWidth,
        };

        select(group.node())
            .select("text")
            .call(defaultTextOverflowHandler, args);

        expect(
            Math.abs(
                (textElement.node()?.getComputedTextLength() || 0) - textWidth
            ) < 0.75
        ).toEqual(true);
        expect(textElement.select(".ellipsis").empty()).toEqual(true);
    });

    it("should add the IGNORE_INTERACTION_CLASS to the text and ellipsis tspans", () => {
        select(group.node()).select("text").text("testText");
        const args = {
            widthLimit: textWidth / 2,
            horizontalPadding: 0,
            ellipsisWidth,
        };

        select(group.node())
            .select("text")
            .call(defaultTextOverflowHandler, args);

        expect(
            textElement.select(".text").classed(IGNORE_INTERACTION_CLASS)
        ).toEqual(true);
        expect(
            textElement.select(".ellipsis").classed(IGNORE_INTERACTION_CLASS)
        ).toEqual(true);
    });
});
