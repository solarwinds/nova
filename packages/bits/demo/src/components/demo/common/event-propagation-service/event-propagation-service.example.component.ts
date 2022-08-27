import { Component, Inject } from "@angular/core";

import {
    EventPropagationService,
    IEventPropagationService,
    IToastService,
    ToastService,
} from "@nova-ui/bits";

@Component({
    selector: "nui-event-propagation-service-example",
    templateUrl: "./event-propagation-service.example.component.html",
})
export class EventPropagationServiceExampleComponent {
    constructor(
        @Inject(EventPropagationService)
        private eventPropagationService: IEventPropagationService,
        @Inject(ToastService) private toastService: IToastService
    ) {}

    public handleClick(event: Event): void {
        const target = <Element>event.target;
        this.toastService.clear();
        if (this.eventPropagationService.targetShouldPropagate(event)) {
            this.toastService.success({
                message: "Event Target Tag Name: " + target.tagName,
                title: "Event Propagates!",
            });
        } else {
            this.toastService.warning({
                message: "Event Target Tag Name: " + target.tagName,
                title: "Event Doesn't Propagate!",
            });
        }
    }
}
