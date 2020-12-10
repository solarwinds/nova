import { ChangeDetectorRef, Component, HostBinding, Inject, Input, OnChanges, SimpleChanges } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";

import { DRILLDOWN } from "../../services/types";
import { IHasChangeDetector, PIZZAGNA_EVENT_BUS } from "../../types";

import { IListWidgetConfiguration } from "./types";

@Component({
    selector: "nui-list-widget",
    templateUrl: "./list-widget.component.html",
    styleUrls: ["./list-widget.component.less"],
    host: {style: "overflow: scroll"},
})
export class ListWidgetComponent implements IHasChangeDetector, OnChanges {
    static lateLoadKey = "ListWidgetComponent";

    @Input() public data: any;
    @Input() public configuration: IListWidgetConfiguration;

    @Input() @HostBinding("class") public elementClass: string;

    constructor(public changeDetector: ChangeDetectorRef,
        @Inject(PIZZAGNA_EVENT_BUS) private eventBus: EventBus<IEvent>) {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.data) {
            console.log("widgetData", changes.data.currentValue);
        }
    }

    getPropsFor(item: any) {
        const properties: { [key: string]: any } = {
            ...this.configuration.itemProperties,
        };

        const map = this.configuration.itemConfigurationMap;
        if (map) {
            for (const key of Object.keys(map)) {
                let valueToMap;
                const keysToMap = map[key];

                if (Array.isArray(keysToMap)) {
                    valueToMap = keysToMap.reduce((acc, val) => {
                        acc[val] = item[val];
                        return acc;
                    }, {});
                } else {
                    valueToMap = item[keysToMap];
                }

                properties[key] = valueToMap;
            }
        }

        return properties;
    }

    // TODO: think of how to get rid of this logic on listWidget
    // since it's very specific for drilldown and appstack
    onListItemEvent(item: any) {
        this.eventBus.getStream(DRILLDOWN).next({ payload: item });
    }

}
