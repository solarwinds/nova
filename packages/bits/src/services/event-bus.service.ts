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

import { Injectable, OnDestroy, Renderer2, RendererFactory2 } from "@angular/core";

import { EventBus } from "./event-bus";
import { DOCUMENT_CLICK_EVENT } from "../constants/event.constants";

/**
 * Service to share events among components in nova
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class EventBusService extends EventBus<Event> implements OnDestroy {
    private renderer: Renderer2;
    private listenerUnsubscriber?: () => void;

    constructor(rendererFactory: RendererFactory2) {
        super();
        // Angular does not allow to easily use renderer in services. This is a workaround
        this.renderer = rendererFactory.createRenderer(null, null);
        // This is moved from popup code.
        // Every event that is triggered for document should be handled by popup,
        // but we should register listener only once
        this.listenerUnsubscriber = this.renderer.listen("document", "click", (event: MouseEvent) => {
            // separate stream to detect document-body clicks in case of popup in popover
            this.getStream(DOCUMENT_CLICK_EVENT).next(event);
        });
    }

    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.listenerUnsubscriber?.();
    }
}
