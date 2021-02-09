import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { IWidget, IWidgetTemplateSelector, PizzagnaLayer, WidgetTypesService } from "@nova-ui/dashboards";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";

import { widgets } from "../widgets";

@Component({
    selector: "acme-clone-selection",
    templateUrl: "./acme-clone-selection.component.html",
    styleUrls: ["./acme-clone-selection.component.less"],
})
export class AcmeCloneSelectionComponent implements IWidgetTemplateSelector, OnInit {
    static lateLoadKey = "AcmeCloneSelectionComponent";

    @Output() public widgetSelected = new EventEmitter<IWidget>();

    public widgetItems: any[] = [];
    public widgetSelection: any[];

    constructor(protected widgetTypesService: WidgetTypesService) {
    }

    public ngOnInit() {
        const titleCasePipe = new TitleCasePipe();

        this.widgetItems = widgets.map(w => {
            console.log(w);
            const typeDisplay = titleCasePipe.transform(w.type);
            return ({
                title: typeDisplay,
                widget: this.widgetTypesService.mergeWithWidgetType(w),
            });
        });
        this.onSelect([this.widgetItems[0]]);
        widgets.forEach((widgetConfig) => {
            this.addUnconfiguredWidgetWithConfigLayer(widgetConfig);
        });

    }

    private addUnconfiguredWidgetWithConfigLayer(widget: IWidget) {
        const typeDisplay = new TitleCasePipe().transform(widget.type);
        this.widgetItems.push({
            title: `Unconfigured ${typeDisplay} With Config Layer`,
            widget: {
                ...cloneDeep(this.widgetTypesService.mergeWithWidgetType(widget)),
                id: `unconfiguredWithConfigLayer${typeDisplay}`,
                metadata: {
                    needsConfiguration: true,
                },
            },
        });
        set(this.widgetItems[this.widgetItems.length - 1].widget.pizzagna, `${PizzagnaLayer.Configuration}.header.properties.title`, `Unconfigured ${typeDisplay} With Config Layer`);
    }

    public onSelect(selectedItems: any[]) {
        this.widgetSelected.emit(selectedItems[0].widget);
        this.widgetSelection = selectedItems;
    }
}
