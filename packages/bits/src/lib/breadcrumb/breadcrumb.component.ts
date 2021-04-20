import {Component, EventEmitter, Input, Output, ViewEncapsulation} from "@angular/core";

import { BreadcrumbItem } from "./public-api";

// <example-url>./../examples/index.html#/breadcrumb</example-url>

@Component({
    selector: "nui-breadcrumb",
    styleUrls: ["./breadcrumb.component.less"],
    templateUrl: "./breadcrumb.component.html",
    encapsulation: ViewEncapsulation.None,
    host: { "aria-label": "Breadcrumb" },
})
export class BreadcrumbComponent {
    @Input() items: BreadcrumbItem[];
    @Input() ariaLabel: string = "Breadcrumb"
    @Output() navigation = new EventEmitter<string>();

    public handleClick(event: Event, item: BreadcrumbItem) {
        event.preventDefault();

        // We want to only handle the CRTL + Click event separately because Middle Mouse click
        // requires a different way of handling it, and so it doesn't conflict with the regular click event.
        if ((event as any).ctrlKey) {
            if (item?.url) {
                // This opens the url link in a new browser tab
                window.open(item?.url, "_blank");
            }
            return;
        }
        // We only navigate the angular router on regular clicks
        this.navigation.emit(item.routerState);
    }
}
