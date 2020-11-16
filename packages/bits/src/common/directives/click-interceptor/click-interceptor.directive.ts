import { Directive, HostListener } from "@angular/core";

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
        this.eventBusService.getEventStream("document-click").next(event);
    }

    constructor(private eventBusService: EventBusService) { }
}
