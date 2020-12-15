import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { IWidget, IWidgetTemplateSelector, PizzagnaLayer, WidgetTypesService } from "@nova-ui/dashboards";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";

import { cloneSelectionImages, IImageDef } from "../../timeseries/widget-configs";
import { widgets } from "../widgets";

interface IWidgetItem {
    title: string;
    image: IImageDef;
    widget: IWidget;
}

@Component({
    selector: "acme-clone-selection",
    templateUrl: "./acme-clone-selection.component.html",
    styleUrls: ["./acme-clone-selection.component.less"],
})
export class AcmeCloneSelectionComponent implements IWidgetTemplateSelector, OnInit {
    static lateLoadKey = "AcmeCloneSelectionComponent";

    @Output() public widgetSelected = new EventEmitter<IWidget>();

    public widgetItems: IWidgetItem[] = [];
    public widgetSelection: IWidgetItem[];

    constructor(protected widgetTypesService: WidgetTypesService) {
    }

    public ngOnInit() {
        const titleCasePipe = new TitleCasePipe();

        this.widgetItems = widgets.map(w => {
            const typeDisplay = titleCasePipe.transform(w.type);
            return ({
                title: typeDisplay,
                image: cloneSelectionImages[w.type],
                widget: this.widgetTypesService.mergeWithWidgetType(w),
            });
        });

        widgets.forEach((widgetConfig) => {
            this.addUnconfiguredWidgetWithConfigLayer(widgetConfig);
        });

        // These are here for future testing and hardening of converters
        // this.addUnconfiguredWidget("timeseries");
        // this.addUnconfiguredWidget("kpi");
        // this.addUnconfiguredWidget("proportional");
        // this.addUnconfiguredWidget("table");

        // this.onSelect([this.widgetItems[0]]);
    }

    private addUnconfiguredWidget(type: string) {
        const typeDisplay = new TitleCasePipe().transform(type);
        this.widgetItems.push({
            title: `Unconfigured ${typeDisplay}`,
            image: cloneSelectionImages[type],
            widget: {
                id: `unconfigured${typeDisplay}`,
                type: type,
                metadata: {
                    needsConfiguration: true,
                },
                pizzagna: cloneDeep(this.widgetTypesService.getWidgetType(type).widget),
            },
        });
        set(this.widgetItems[this.widgetItems.length - 1].widget.pizzagna, `${PizzagnaLayer.Structure}.header.properties.title`, `Unconfigured ${typeDisplay}`);
    }

    private addUnconfiguredWidgetWithConfigLayer(widget: IWidget) {
        const typeDisplay = new TitleCasePipe().transform(widget.type);
        this.widgetItems.push({
            title: `Unconfigured ${typeDisplay} With Config Layer`,
            image: cloneSelectionImages[widget.type],
            widget: {
                id: `unconfiguredWithConfigLayer${typeDisplay}`,
                metadata: {
                    needsConfiguration: true,
                },
                ...cloneDeep(this.widgetTypesService.mergeWithWidgetType(widget)),
            },
        });
        set(this.widgetItems[this.widgetItems.length - 1].widget.pizzagna, `${PizzagnaLayer.Configuration}.header.properties.title`, `Unconfigured ${typeDisplay} With Config Layer`);
    }

    public onSelect(selectedItems: any[]) {
        this.widgetSelected.emit(selectedItems[0].widget);
        this.widgetSelection = selectedItems;
    }
}
