import { Directive, HostListener } from "@angular/core";

import { DOCUMENT_CLICK_EVENT } from "../../../constants/event.constants";
import { EventBusService } from "../../../services/event-bus.service";

/**
 *
 * <h4>Required Modules</h4>
 *  <ul>
 *   <li>
 *      <code>NuiCommonModule</code>
 *   </li>
 *  </ul>
 *
 */

@Directive({
    selector: "[nuiClickInterceptor]",
})
export class ClickInterceptorDirective {
    @HostListener("click", ["$event"])
    catchClick(event: MouseEvent) {
        event.stopPropagation();
        this.eventBusService
            .getStream({ id: DOCUMENT_CLICK_EVENT })
            .next(event);
    }

    constructor(private eventBusService: EventBusService) {}
}
