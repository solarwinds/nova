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

import { OverlayRef } from "@angular/cdk/overlay";
import some from "lodash/some";

import { OverlayComponent } from "./overlay-component/overlay.component";
import { IResizeConfig } from "./types";

export class OverlayUtilitiesService {
    private overlayComponent: OverlayComponent;

    public setPopupComponent(
        overlayComponent: OverlayComponent
    ): OverlayUtilitiesService {
        this.overlayComponent = overlayComponent;
        return this;
    }

    // might be heavy, think about another way to handle that
    public getResizeObserver(config?: IResizeConfig): ResizeObserver {
        // We need the overlay to keep track of the width and height of its toggle reference in order to follow it's dimensions.
        // Derived from NUI-4744
        const toggleRefResizeObserver$ = new ResizeObserver(
            (entries: ResizeObserverEntry[]) => {
                // We need to use requestAnimationFrame here to avoid a common 'ResizeObserver loop limit exceeded' error.
                // This error means that ResizeObserver was not able to deliver all observations within a single animation frame.
                // This error is not breaking for the component, and can be ignored, though it breaks unit tests heavily.
                // https://stackoverflow.com/questions/49384120/resizeobserver-loop-limit-exceeded
                window.requestAnimationFrame(() => {
                    if (!Array.isArray(entries) || !entries.length) {
                        return;
                    }

                    entries.forEach((entry: ResizeObserverEntry) => {
                        this.overlayComponent.getOverlayRef()?.updatePosition();
                        if (!(config && config.updateSize === false)) {
                            this.overlayComponent.getOverlayRef()?.updateSize({
                                width: entry.target.getBoundingClientRect()
                                    .width,
                            });
                        }
                    });
                });
            }
        );
        return toggleRefResizeObserver$;
    }

    public syncWidth(): void {
        const overlayRef = this.getOverlayRef();
        if (!overlayRef) {
            return;
        }

        if (this.isOverlayWidthConfigured) {
            return;
        }

        const refRect =
            this.overlayComponent.toggleReference.getBoundingClientRect();
        const popupWidth = refRect.width;
        this.overlayComponent.getOverlayRef().updateSize({ width: popupWidth });
    }

    private getOverlayRef(): OverlayRef {
        return this.overlayComponent?.getOverlayRef();
    }

    private get isOverlayWidthConfigured(): boolean {
        return (
            this.overlayComponent.overlayConfig &&
            some([
                this.overlayComponent.overlayConfig.width,
                this.overlayComponent.overlayConfig.minWidth,
                this.overlayComponent.overlayConfig.maxWidth,
            ])
        );
    }
}
