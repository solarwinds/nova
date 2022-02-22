import { ChangeDetectorRef, Component, HostBinding, Input, OnInit } from "@angular/core";

import { IHasChangeDetector } from "../../../types";
import { IWidgetErrorDisplayProperties } from "../../../components/widget/types";

@Component({
    selector: "nui-widget-error",
    templateUrl: "./widget-error.component.html",
    styleUrls: ["./widget-error.component.less"],
})
export class WidgetErrorComponent implements OnInit, IHasChangeDetector, IWidgetErrorDisplayProperties {
    public static lateLoadKey = "WidgetErrorComponent";

    public readonly defaultClasses = "d-flex flex-column justify-content-center w-100 p-3";

    @Input() public image: string;
    @Input() public title: string;
    @Input() public description: string;

    /**
     * Optional class for styling
     */
    @Input() public elementClass = "";

    @HostBinding("class") public classNames: string;

    constructor(public changeDetector: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.classNames = `${this.defaultClasses} ${this.elementClass}`;
    }
}
