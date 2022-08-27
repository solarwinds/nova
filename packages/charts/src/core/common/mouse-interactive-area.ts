import { event, mouse } from "d3-selection";
import { BehaviorSubject } from "rxjs";

import { IGNORE_INTERACTION_CLASS } from "../../constants";
import { IAllAround } from "../grid/types";
import { D3Selection, IInteractionEvent, InteractionType } from "./types";

/**
 * @ignore
 */
export class MouseInteractiveArea<
    TTarget extends D3Selection<SVGGElement> = D3Selection<SVGGElement>,
    TInteractiveArea extends D3Selection<SVGRectElement> = D3Selection<SVGRectElement>
> {
    public static CONTAINER_CLASS = "mouse-interactive-area";

    public readonly active = new BehaviorSubject<boolean>(false);
    public readonly interaction = new BehaviorSubject<IInteractionEvent>({
        type: InteractionType.Click,
        coordinates: { x: 0, y: 0 },
    });
    private isActive = false;

    constructor(
        private target: TTarget,
        private interactiveArea: TInteractiveArea,
        cursor: string,
        private gridMargin?: IAllAround<number>
    ) {
        this.interactiveArea
            .style("cursor", cursor)
            .classed(MouseInteractiveArea.CONTAINER_CLASS, true);
        this.target
            .on("mouseover", this.onMouseOver)
            .on("mouseout", this.onMouseOut)
            .on(InteractionType.MouseDown, () =>
                this.onMouseInteraction(InteractionType.MouseDown)
            )
            .on(InteractionType.MouseUp, () =>
                this.onMouseInteraction(InteractionType.MouseUp)
            )
            .on(InteractionType.MouseMove, () =>
                this.onMouseInteraction(InteractionType.MouseMove)
            )
            .on(InteractionType.Click, () =>
                this.onMouseInteraction(InteractionType.Click)
            );
    }

    public onMouseInteraction = (interactionType: InteractionType): void => {
        if (event.target.classList.contains(IGNORE_INTERACTION_CLASS)) {
            return;
        }

        let x: number = 0,
            y: number = 0;
        const interactiveAreaWidth =
            parseInt(this.interactiveArea.attr("width"), 10) || 0;
        const interactiveAreaHeight =
            parseInt(this.interactiveArea.attr("height"), 10) || 0;

        // Hack from https://stackoverflow.com/questions/7000190/detect-all-firefox-versions-in-js#comment28264971_7000222
        const isFirefox = /firefox/i.test(navigator.userAgent);

        // Hack from https://github.com/d3/d3-selection/issues/81#issuecomment-528321960
        if (isFirefox) {
            // this works in Firefox

            // Note: Margin must be subtracted because of the transform that occurs in XYGrid.recalculateMargins
            let calculatedX = x + event.offsetX - (this.gridMargin?.left || 0);

            // clamp output to right or left side of interactive area if necessary
            calculatedX =
                calculatedX > interactiveAreaWidth
                    ? interactiveAreaWidth
                    : calculatedX;
            x = calculatedX < 0 ? 0 : calculatedX;

            // Note: Margin must be subtracted because of the transform that occurs in XYGrid.recalculateMargins
            let calculatedY = y + event.offsetY - (this.gridMargin?.top || 0);

            // clamp output to top or bottom side of interactive area if necessary
            calculatedY =
                calculatedY > interactiveAreaHeight
                    ? interactiveAreaHeight
                    : calculatedY;
            y = calculatedY < 0 ? 0 : calculatedY;
        } else {
            // this works in Chrome

            const mouseOutput = mouse(event.currentTarget);

            // clamp output to right or left side of interactive area if necessary
            const calculatedX =
                mouseOutput[0] > interactiveAreaWidth
                    ? interactiveAreaWidth
                    : mouseOutput[0];
            x = calculatedX < 0 ? 0 : calculatedX;

            // clamp output to top or bottom side of interactive area if necessary
            const calculatedY =
                mouseOutput[1] > interactiveAreaHeight
                    ? interactiveAreaHeight
                    : mouseOutput[1];
            y = calculatedY < 0 ? 0 : calculatedY;
        }
        this.interaction.next({
            type: interactionType,
            coordinates: { x, y },
        });
    };

    public onMouseOver = (): void => {
        if (
            this.isActive ||
            event.target.classList.contains(IGNORE_INTERACTION_CLASS)
        ) {
            return;
        }

        this.isActive = true;
        this.active.next(true);
    };

    public onMouseOut = (): void => {
        if (!this.isActive) {
            return;
        }

        // we're leaving the element – where to? Maybe to a descendant of the lasagna container? If so, we're still active.
        let relatedTarget = event.relatedTarget;
        while (relatedTarget) {
            // go up the parent chain and check – if we're still inside the lasagna container, that's an internal transition – ignore it
            if (relatedTarget === this.target.node()) {
                return;
            }

            relatedTarget = relatedTarget.parentNode;
        }

        this.isActive = false;
        this.active.next(false);
    };

    // Remove in v12 - NUI-5827
    /** @deprecated - Please use 'onMouseOver' instead */
    public onMouseEnter = (): void => {
        this.onMouseOver();
    };

    // Remove in v12 - NUI-5827
    /** @deprecated - Please use 'onMouseOut' instead */
    public onMouseLeave = (): void => {
        this.onMouseOut();
    };
}
