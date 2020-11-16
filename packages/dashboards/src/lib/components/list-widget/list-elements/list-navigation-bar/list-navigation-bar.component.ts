import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Inject, Input, Output } from "@angular/core";
import { EventBus, IEvent } from "@solarwinds/nova-bits";

import { DRILLDOWN } from "../../../../services/types";
import { PIZZAGNA_EVENT_BUS } from "../../../../types";
import { INavigationBarConfig } from "../../types";

@Component({
    selector: "nui-navigation-bar",
    templateUrl: "./list-navigation-bar.component.html",
    styleUrls: ["list-navigation-bar.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListNavigationBarComponent {
    static lateLoadKey = "ListNavigationBarComponent";

    @Input() public navBarConfig: INavigationBarConfig;

    @Output() public navigated = new EventEmitter();

    constructor(public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
    }

    onBack() {
        if (this.navBarConfig) {
            this.eventBus.getStream(DRILLDOWN).next({ payload: { back: this.navBarConfig?.buttons?.back?.disabled } });
        }
    }

    onHome() {
        this.eventBus.getStream(DRILLDOWN).next({ payload: { reset: true } });
    }

}
