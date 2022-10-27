// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { TitleCasePipe } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import cloneDeep from "lodash/cloneDeep";
import set from "lodash/set";

import {
    IWidget,
    IWidgetTemplateSelector,
    PizzagnaLayer,
    WidgetTypesService,
} from "@nova-ui/dashboards";

import { widgets } from "../widgets";

interface IWidgetItem {
    title: string;
    widget: IWidget;
}

@Component({
    selector: "acme-clone-selection",
    templateUrl: "./acme-clone-selection.component.html",
    styleUrls: ["./acme-clone-selection.component.less"],
})
export class AcmeCloneSelectionComponent
    implements IWidgetTemplateSelector, OnInit
{
    static lateLoadKey = "AcmeCloneSelectionComponent";

    @Output() public widgetSelected = new EventEmitter<IWidget>();

    public widgetItems: IWidgetItem[] = [];
    public widgetSelection: IWidgetItem[];

    constructor(protected widgetTypesService: WidgetTypesService) {}

    public ngOnInit() {
        const titleCasePipe = new TitleCasePipe();

        this.widgetItems = widgets.map((w) => {
            const typeDisplay = titleCasePipe.transform(w.type);
            return {
                title: typeDisplay,
                widget: this.widgetTypesService.mergeWithWidgetType(w),
            };
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
            widget: {
                id: `unconfigured${typeDisplay}`,
                type: type,
                metadata: {
                    needsConfiguration: true,
                },
                pizzagna: cloneDeep(
                    this.widgetTypesService.getWidgetType(type).widget
                ),
            },
        });
        set(
            this.widgetItems[this.widgetItems.length - 1].widget.pizzagna,
            `${PizzagnaLayer.Structure}.header.properties.title`,
            `Unconfigured ${typeDisplay}`
        );
    }

    private addUnconfiguredWidgetWithConfigLayer(widget: IWidget) {
        const typeDisplay = new TitleCasePipe().transform(widget.type);
        this.widgetItems.push({
            title: `Unconfigured ${typeDisplay} With Config Layer`,
            widget: {
                ...cloneDeep(
                    this.widgetTypesService.mergeWithWidgetType(widget)
                ),
                id: `unconfiguredWithConfigLayer${typeDisplay}`,
                metadata: {
                    needsConfiguration: true,
                },
            },
        });
        set(
            this.widgetItems[this.widgetItems.length - 1].widget.pizzagna,
            `${PizzagnaLayer.Configuration}.header.properties.title`,
            `Unconfigured ${typeDisplay} With Config Layer`
        );
    }

    public onSelect(selectedItems: any[]) {
        this.widgetSelected.emit(selectedItems[0].widget);
        this.widgetSelection = selectedItems;
    }
}
