import { TitleCasePipe } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { IWidgetTemplateSelector, WidgetTypesService } from "@solarwinds/nova-dashboards";

import { widgets } from "../widgets";

import { AcmeCloneSelectionComponent } from "./acme-clone-selection.component";

@Component({
    selector: "acme-clone-selection",
    templateUrl: "./acme-clone-selection.component.html",
    styleUrls: ["./acme-clone-selection.component.less"],
})
export class AcmeEditWithClonerComponent extends AcmeCloneSelectionComponent implements IWidgetTemplateSelector, OnInit {
    static lateLoadKey = "AcmeCloneSelectionComponent";

    constructor(widgetTypesService: WidgetTypesService) {
        super(widgetTypesService);
    }

    public ngOnInit() {
        const titleCasePipe = new TitleCasePipe();

        this.widgetItems = widgets.map(w => {
            const typeDisplay = titleCasePipe.transform(w.type);
            return ({
                title: typeDisplay,
                widget: this.widgetTypesService.mergeWithWidgetType(w),
            });
        });
    }
}
