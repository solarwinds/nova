import { Component, OnInit } from "@angular/core";
import { GridsterConfig, GridsterItemConfig } from "angular-gridster2";

import {
    IDashboard,
    IKpiData,
    IWidget,
    IWidgets,
    KpiComponent,
    PizzagnaLayer,
    WidgetTypesService,
} from "@nova-ui/dashboards";

interface IKpiLabelComparisonWidget {
    id: string;
    title: string;
    label: string;
    value: number;
    units: string;
    x: number;
    y: number;
    labelIcon?: string;
    labelIconTooltip?: string;
}

const comparisonWidgets: IKpiLabelComparisonWidget[] = [
    {
        id: "kpiShortLabel",
        title: "Short label",
        label: "CPU",
        value: 18,
        units: "%",
        x: 0,
        y: 0,
    },
    {
        id: "kpiShortLabelWithIcon",
        title: "Short label + icon",
        label: "CPU",
        labelIcon: "clock_off",
        labelIconTooltip: "Not affected by dashboard time filter",
        value: 18,
        units: "%",
        x: 4,
        y: 0,
    },
    {
        id: "kpiMediumLabel",
        title: "Medium label",
        label: "Average response time",
        value: 128,
        units: "ms",
        x: 8,
        y: 0,
    },
    {
        id: "kpiMediumLabelWithIcon",
        title: "Medium label + icon",
        label: "Average response time",
        labelIcon: "clock_off",
        labelIconTooltip: "Not affected by dashboard time filter",
        value: 128,
        units: "ms",
        x: 0,
        y: 3,
    },
    {
        id: "kpiLongLabel",
        title: "Long label",
        label: "Average response time for background synchronization jobs",
        value: 256,
        units: "ms",
        x: 4,
        y: 3,
    },
    {
        id: "kpiLongLabelWithIcon",
        title: "Long label + icon",
        label: "Average response time for background synchronization jobs",
        labelIcon: "clock_off",
        labelIconTooltip: "Not affected by dashboard time filter",
        value: 256,
        units: "ms",
        x: 8,
        y: 3,
    },
];

@Component({
    selector: "kpi-widget-label-resize-example",
    templateUrl: "./kpi-widget-label-resize-example.component.html",
    styleUrls: ["./kpi-widget-label-resize-example.component.less"],
    standalone: false,
})
export class KpiWidgetLabelResizeExampleComponent implements OnInit {
    public dashboard!: IDashboard;
    public gridsterConfig: GridsterConfig = {};

    constructor(private widgetTypesService: WidgetTypesService) {}

    public ngOnInit(): void {
        const positions = comparisonWidgets.reduce(
            (
                accumulator: Record<string, GridsterItemConfig>,
                widget: IKpiLabelComparisonWidget
            ) => {
                accumulator[widget.id] = {
                    cols: 4,
                    rows: 3,
                    x: widget.x,
                    y: widget.y,
                };

                return accumulator;
            },
            {}
        );

        const widgets = comparisonWidgets.reduce(
            (accumulator: IWidgets, widget: IKpiLabelComparisonWidget) => {
                const widgetConfig = this.createWidgetConfig(widget);

                accumulator[widgetConfig.id] =
                    this.widgetTypesService.mergeWithWidgetType(widgetConfig);

                return accumulator;
            },
            {} as IWidgets
        );

        this.dashboard = {
            positions,
            widgets,
        };
    }

    private createWidgetConfig(
        widget: IKpiLabelComparisonWidget
    ): IWidget {
        const componentId = `${widget.id}-tile`;
        const widgetData: IKpiData = {
            label: widget.label,
            value: widget.value,
            units: widget.units,
        };

        if (widget.labelIcon) {
            widgetData.labelIcon = widget.labelIcon;
            widgetData.labelIconTooltip = widget.labelIconTooltip;
        }

        return {
            id: widget.id,
            type: "kpi",
            pizzagna: {
                [PizzagnaLayer.Configuration]: {
                    header: {
                        properties: {
                            title: widget.title,
                        },
                    },
                    tiles: {
                        properties: {
                            nodes: [componentId],
                        },
                    },
                    [componentId]: {
                        id: componentId,
                        componentType: KpiComponent.lateLoadKey,
                        properties: {
                            widgetData,
                        },
                    },
                },
            },
        };
    }
}