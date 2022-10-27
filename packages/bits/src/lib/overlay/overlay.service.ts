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

import {
    Overlay,
    OverlayConfig,
    OverlayContainer,
    OverlayRef,
    OverlaySizeConfig,
} from "@angular/cdk/overlay";
import { Portal } from "@angular/cdk/portal";
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, OnDestroy, Optional } from "@angular/core";
import { Subject } from "rxjs";

import { OVERLAY_CONTAINER } from "./constants";
import { OverlayCustomContainer } from "./overlay-custom-container";
import { OverlayContainerType, OVERLAY_PANEL_CLASS } from "./types";

/* @dynamic */
/**
 * @ignore
 */
@Injectable()
export class OverlayService implements OnDestroy {
    // inputs
    public contentTemplate: Portal<any>; // double check the type
    public customContainer: OverlayContainerType;

    // props/outputs
    public showing = false;
    public show$: Subject<void> = new Subject<void>();
    public hide$: Subject<void> = new Subject<void>();

    public get overlayConfig(): OverlayConfig {
        if (!this._overlayConfig) {
            this.defineOverlayConfig();
        }
        return this._overlayConfig;
    }
    public set overlayConfig(value: OverlayConfig) {
        this._overlayConfig = value;
    }
    private _overlayConfig: OverlayConfig;
    private overlayRef: OverlayRef;

    constructor(
        protected overlay: Overlay,
        protected overlayContainer: OverlayContainer,
        @Inject(DOCUMENT) protected document: Document,
        @Optional()
        @Inject(OVERLAY_CONTAINER)
        private customContainerInjection: OverlayContainerType
    ) {}

    public createOverlay() {
        this.appendToContainer();
        this.overlayRef = this.overlay.create(this.overlayConfig);
        this.overlayRef.attach(this.contentTemplate);
        this.overlayRef.addPanelClass(OVERLAY_PANEL_CLASS);
    }

    public show() {
        if (this.showing) {
            return;
        }
        this.createOverlay();

        this.showing = true;
        this.show$.next();
    }

    public hide() {
        if (!this.showing) {
            return;
        }
        this.disposeOverlayRef();

        this.showing = false;
        this.hide$.next();
    }

    public getOverlayRef() {
        return this.overlayRef;
    }

    public updateSize(size: OverlaySizeConfig): void {
        this.overlayRef.updateSize(size);
    }

    public ngOnDestroy() {
        this.show$.complete();
        this.hide$.complete();
    }

    private defineOverlayConfig(): void {
        const positionStrategy = this.overlay
            .position()
            .global()
            .centerHorizontally()
            .centerVertically();
        const scrollStrategy = this.overlay.scrollStrategies.reposition();

        this._overlayConfig = new OverlayConfig({
            positionStrategy,
            scrollStrategy,
            hasBackdrop: false,
            disposeOnNavigation: true,
            backdropClass: "cdk-overlay-transparent-backdrop",
        });
    }

    private disposeOverlayRef() {
        if (this.overlayRef?.hasAttached()) {
            this.overlayRef.dispose();
        }
    }

    private appendToContainer(): void {
        let container: HTMLElement | undefined;
        const customContainer =
            this.customContainer || this.customContainerInjection; // input is a priority

        if (customContainer) {
            container =
                typeof customContainer === "string"
                    ? this.document.querySelector<HTMLElement>(
                          customContainer
                      ) ?? undefined
                    : customContainer.nativeElement;

            if (!container) {
                console.warn(
                    `Specified container is not found: ${customContainer}. \nAppending to body.`
                );
                container = this.document.body;
            }
        } else {
            container = this.document.body;
        }

        (this.overlayContainer as OverlayCustomContainer).setContainer(
            container
        );
    }
}
