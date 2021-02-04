import { Overlay, OverlayConfig, OverlayContainer, OverlayRef } from "@angular/cdk/overlay";
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
        if (!this._overlayConfig) { this.defineOverlayConfig(); }
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
        @Optional() @Inject(OVERLAY_CONTAINER) private customContainerInjection: OverlayContainerType
    ) { }

    public createOverlay() {
        this.appendToContainer();
        this.overlayRef = this.overlay.create(this.overlayConfig);
        this.overlayRef.attach(this.contentTemplate);
        this.overlayRef.addPanelClass(OVERLAY_PANEL_CLASS);
    }

    public show() {
        if (this.showing) { return; }
        this.createOverlay();

        this.showing = true;
        this.show$.next();
    }

    public hide() {
        if (!this.showing) { return; }
        this.disposeOverlayRef();

        this.showing = false;
        this.hide$.next();
    }

    public getOverlayRef() {
        return this.overlayRef;
    }

    public ngOnDestroy() {
        this.show$.complete();
        this.hide$.complete();
    }

    private defineOverlayConfig(): void {
        const positionStrategy = this.overlay.position().global()
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
        const customContainer = this.customContainer || this.customContainerInjection; // input is a priority

        if (customContainer) {
            container = typeof customContainer === "string"
                ? this.document.querySelector<HTMLElement>(customContainer) ?? undefined
                : customContainer.nativeElement;

            if (!container) {
                console.warn(`Specified container is not found: ${customContainer}. \nAppending to body.`);
                container = this.document.body;
            }
        } else {
            container = this.document.body;
        }

        (this.overlayContainer as OverlayCustomContainer).setContainer(container);
    }
}
