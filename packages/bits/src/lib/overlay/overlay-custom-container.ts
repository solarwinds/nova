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
