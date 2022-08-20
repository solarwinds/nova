import { Injectable, Renderer2, RendererFactory2 } from "@angular/core";

import { DOCUMENT_CLICK_EVENT } from "../constants/event.constants";

import { EventBus } from "./event-bus";

/**
 * Service to share events among components in nova
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class EventBusService extends EventBus<Event> {
    private renderer: Renderer2;

    constructor(rendererFactory: RendererFactory2) {
        super();
        // Angular does not allow to easily use renderer in services. This is a workaround
        this.renderer = rendererFactory.createRenderer(null, null);
        // This is moved from popup code.
        // Every event that is triggered for document should be handled by popup,
        // but we should register listener only once
        this.renderer.listen("document", "click", (event: Event) => {
            // separate stream to detect document-body clicks in case of popup in popover
            this.getStream({ id: DOCUMENT_CLICK_EVENT }).next(event);
        });
    }
}
