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

import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItem } from "angular-gridster2";

import {
    ComponentRegistryService,
    EmbeddedContentComponent,
    EmbeddedContentConfigurationComponent,
    EmbeddedContentMode,
    IDashboard,
    IWidget,
    IWidgets,
    PizzagnaLayer,
    WidgetTypesService,
} from "@nova-ui/dashboards";

@Component({
    selector: "embedded-content-widget-example",
    templateUrl: "./embedded-content-widget-example.component.html",
    styleUrls: ["./embedded-content-widget-example.component.less"],
})
export class EmbeddedContentWidgetExampleComponent implements OnInit {
    // This variable will hold all the data needed to define the layout and behavior of the widgets.
    // Pass this to the dashboard component's dashboard input in the template.
    public dashboard: IDashboard | undefined;

    // Angular gridster requires a configuration object even if it's empty.
    // Pass this to the dashboard component's gridsterConfig input in the template.
    public gridsterConfig: GridsterConfig = {};

    // Boolean passed as an input to the dashboard. When true, widgets can be moved, resized, removed, or edited
    public editMode: boolean = false;

    constructor(
        // WidgetTypesService provides the widget's necessary structure information
        private widgetTypesService: WidgetTypesService,

        private componentRegistry: ComponentRegistryService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    public ngOnInit(): void {
        this.prepareNovaDashboards();
        this.initializeDashboard();
    }

    /** Used for restoring widgets state */
    public reInitializeDashboard(): void {
        // destroys the components and their providers so the dashboard can re init data
        this.dashboard = undefined;
        this.changeDetectorRef.detectChanges();

        this.initializeDashboard();
    }

    public initializeDashboard(): void {
        // We're using a static configuration object for this example, but this is where
        // the widget's configuration could potentially be populated from a database
        const embeddedContentWidget = widgetConfig;
        const widgets: IWidgets = {
            // Complete the widget with information coming from its type definition
            [embeddedContentWidget.id]:
                this.widgetTypesService.mergeWithWidgetType(
                    embeddedContentWidget
                ),
        };

        // Setting the widget dimensions and position (this is for gridster)
        const positions: Record<string, GridsterItem> = {
            [embeddedContentWidget.id]: {
                cols: 10,
                rows: 10,
                y: 0,
                x: 0,
            },
        };

        // Finally, assigning the variables we created above to the dashboard
        this.dashboard = { positions, widgets };
    }

    private prepareNovaDashboards() {
        this.componentRegistry.registerByLateLoadKey(EmbeddedContentComponent);
        this.componentRegistry.registerByLateLoadKey(
            EmbeddedContentConfigurationComponent
        );
    }
}

const widgetConfig: IWidget = {
    id: "embeddedContentWidgetId",
    type: "embedded-content",
    pizzagna: {
        [PizzagnaLayer.Configuration]: {
            header: {
                properties: {
                    title: "Embedded Content Widget",
                    subtitle: "",
                },
            },
            mainContent: {
                properties: {
                    sanitized: true,
                    mode: EmbeddedContentMode.URL,
                    customEmbeddedContent: "https://www.ventusky.com/",
                },
            },
        },
    },
};
