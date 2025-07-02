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

import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild, inject } from "@angular/core";

import { WindowToken } from "../helpers/window";
import {
    BaseCoordinates,
    ColorsConf,
    ElementPadding,
    QueryToken,
    RenderConfigurator,
} from "../models";

@Component({
    selector: "nui-text-highlight-overlay",
    templateUrl: "./text-highlight-overlay-component.html",
    styleUrls: ["./text-highlight-overlay-component.less"],
    standalone: false,
})
export class TextHighlightOverlayComponent<T extends QueryToken>
    implements OnInit, OnChanges
{
    readonly ONE_SIDE_STROKE_WIDTH = 1;
    readonly BOTH_SIDES_STROKE_WIDTH = 2;
    readonly BOX_SUM_PADDING = 8;

    @Input()
    model: { value: string; tokens: T[] };
    @Input()
    renderConfigurator: RenderConfigurator<T>;

    @ViewChild("parentContainer", { static: true })
    parentContainer: ElementRef;
    @ViewChild("textContainer", { static: true })
    textContainer: ElementRef;
    @ViewChild("text", { static: true })
    text: ElementRef;
    @ViewChild("highlightCanvas", { static: true })
    highlightCanvas: ElementRef;

    private get container(): HTMLElement {
        return this.parentContainer.nativeElement;
    }

    private get textHolder(): HTMLTextAreaElement {
        return this.textContainer.nativeElement;
    }

    private get span(): HTMLElement {
        return this.text.nativeElement;
    }

    private window: Window;
    constructor() {
        const window = inject(WindowToken);

        this.window = window as Window;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.model && changes.model.previousValue) {
            setTimeout(() => this.highlightTokens(this.model.tokens));
        }
    }

    ngOnInit(): void {
        // @ts-ignore
        const resizeObserver = new ResizeObserver(() => {
            this.highlightTokens(this.model.tokens);
        });
        resizeObserver.observe(this.textHolder);
        setTimeout(() => this.highlightTokens(this.model.tokens));
    }

    private getBorderWidths(element: HTMLTextAreaElement): ElementPadding {
        const getBorderWidth = (direction: string): number =>
            this.getPixelPropertyValue(
                element,
                "border-" + direction + "-width"
            );

        return {
            top: getBorderWidth("top"),
            bottom: getBorderWidth("bottom"),
            left: getBorderWidth("left"),
            right: getBorderWidth("right"),
        };
    }

    private getPaddings(element: HTMLTextAreaElement): ElementPadding {
        const getPaddingSize = (direction: string): number =>
            this.getPixelPropertyValue(element, "padding-" + direction);

        return {
            top: getPaddingSize("top"),
            bottom: getPaddingSize("bottom"),
            left: getPaddingSize("left"),
            right: getPaddingSize("right"),
        };
    }

    private getPixelPropertyValue(
        element: HTMLElement,
        propName: string
    ): number {
        return Number(
            this.window
                .getComputedStyle(element, null)
                .getPropertyValue(propName)
                .split("px")[0]
        );
    }

    private highlightTokens(tokens: T[]): void {
        const canvas: HTMLCanvasElement = this.highlightCanvas
            .nativeElement as HTMLCanvasElement;
        if (!this.renderConfigurator || !canvas) {
            return;
        }
        const context = canvas.getContext("2d") as CanvasRenderingContext2D;
        this.setupContext(context, canvas);
        if (!tokens || tokens.length === 0) {
            return;
        }
        const containerRect = this.container.getBoundingClientRect();
        const textHolderPaddings = this.getPaddings(this.textHolder);
        const baseLeft: number = containerRect.left + textHolderPaddings.left;
        const baseTop: number = containerRect.top + textHolderPaddings.top;
        if (this.renderConfigurator.enhanceTokens) {
            tokens = this.renderConfigurator.enhanceTokens(tokens);
        }
        this.processTokens(tokens, context, baseLeft, baseTop);
    }

    private processTokens(
        tokens: T[],
        ctx: CanvasRenderingContext2D,
        baseLeft: any,
        baseTop: any
    ): void {
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            const color = this.renderConfigurator.getHighlightColor(token);
            const notifColor = this.renderConfigurator.getNotifColor(token);
            if (!color && !notifColor) {
                continue;
            }
            if (
                !this.span.childNodes[0].textContent ||
                this.span.childNodes[0].textContent.length <= token.start ||
                this.span.childNodes[0].textContent.length <= token.end
            ) {
                continue;
            }
            this.highlightToken(
                token,
                ctx,
                { notif: notifColor, highlight: color },
                { left: baseLeft, top: baseTop }
            );
        }
    }

    private setupContext(
        context: CanvasRenderingContext2D,
        canvas: HTMLCanvasElement
    ): void {
        context.lineWidth = 1;
        const childPaddingSizes = this.getPaddings(this.textHolder);
        const childBorderWidths = this.getBorderWidths(this.textHolder);

        const childHeight = this.getPixelPropertyValue(
            this.textHolder,
            "height"
        );
        const childWidth = this.getPixelPropertyValue(this.textHolder, "width");
        const parentWidth = this.getPixelPropertyValue(this.container, "width");

        context.canvas.width =
            childWidth -
            childPaddingSizes.left -
            childPaddingSizes.right -
            childBorderWidths.left -
            childBorderWidths.right;
        context.canvas.height =
            childHeight -
            childPaddingSizes.top -
            childPaddingSizes.bottom -
            childBorderWidths.top -
            childBorderWidths.bottom;
        context.canvas.style.width = parentWidth + "px";
        context.canvas.style.height = childHeight + "px";
        context.shadowOffsetX = 0;
        context.shadowOffsetY = 0;

        context.clearRect(0, 0, canvas.width, canvas.height);
    }

    private highlightToken(
        token: T,
        context: CanvasRenderingContext2D,
        colors: ColorsConf,
        coordBase: BaseCoordinates
    ): void {
        const range = document.createRange();
        range.setStart(this.span.childNodes[0], token.start);
        range.setEnd(this.span.childNodes[0], token.end);
        const rects = range.getClientRects();

        for (let rectIdx = 0; rectIdx < rects.length; rectIdx++) {
            const rect = rects[rectIdx];
            context.beginPath();
            if (colors.notif) {
                this.addNotificationRectangle(colors, context, rect, coordBase);
            }
            if (colors.highlight) {
                this.addHighlightRectangle(colors, context, rect, coordBase);
            }
            context.closePath();
        }
    }

    private addHighlightRectangle(
        colors: ColorsConf,
        context: CanvasRenderingContext2D,
        rect: DOMRect,
        coordBase: BaseCoordinates
    ): void {
        context.fillStyle = colors.highlight;
        context.fillRect(
            rect.left - coordBase.left - this.ONE_SIDE_STROKE_WIDTH,
            rect.top - coordBase.top,
            rect.width + this.BOX_SUM_PADDING,
            rect.height - this.BOTH_SIDES_STROKE_WIDTH
        );
    }

    private addNotificationRectangle(
        colors: ColorsConf,
        context: CanvasRenderingContext2D,
        rect: DOMRect,
        coordBase: BaseCoordinates
    ): void {
        context.strokeStyle = colors.notif;
        context.strokeRect(
            rect.left - coordBase.left - this.BOTH_SIDES_STROKE_WIDTH,
            rect.top - coordBase.top - this.ONE_SIDE_STROKE_WIDTH,
            rect.width + this.BOX_SUM_PADDING + this.BOTH_SIDES_STROKE_WIDTH,
            rect.height
        );
    }
}
