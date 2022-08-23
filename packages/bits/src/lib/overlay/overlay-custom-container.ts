/**
 * Alternative to OverlayContainer that supports custom container
 *
 * Should be provided in the root component.
 */
import { OverlayContainer } from "@angular/cdk/overlay";
import { Platform } from "@angular/cdk/platform";
import { DOCUMENT } from "@angular/common";
import { Inject, Injectable, OnDestroy } from "@angular/core";

import { OverlayContainerService } from "./overlay-container.service";

/** @dynamic */
@Injectable()
export class OverlayCustomContainer
    extends OverlayContainer
    implements OnDestroy
{
    constructor(
        @Inject(DOCUMENT) document: Document,
        platform: Platform,
        private overlayService: OverlayContainerService
    ) {
        super(document, platform);
    }

    public setContainer(element: Element) {
        this._containerElement =
            this.overlayService.getOverlayContainer(element);
    }

    public ngOnDestroy(): void {
        // Overriding default destroy to prevent unwanted cleanup
    }
}
