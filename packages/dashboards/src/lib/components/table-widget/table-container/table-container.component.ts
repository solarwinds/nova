import { Component, Input } from "@angular/core";
import { ITableWidgetColumnConfig } from "../types";
import { TableAlignmentOptions } from "@nova-ui/bits";
import { TableFormatterRegistryService } from "../../../services/table-formatter-registry.service";
import { ITableFormatterDefinition } from "../../types";

@Component({
    selector: "nui-table-widget-container",
    styleUrls: ["./table-container.component.less"],
    templateUrl: "./table-container.component.html",
    host: {
        // Note: Moved here from configuration to ensure that consumers will not override it.
        // Used to prevent table overflowing preview container in the edit/configuration mode.
        "[class.table-widget-fullwidth]": "true",
    },
})
export class TableWidgetContainerComponent {
    @Input() public columns: ITableWidgetColumnConfig[] = [];
    @Input() public columnsWidthMap: any;
    @Input() public headerTooltipsEnabled: any;
    // @Input() public getColumnAlignment: any;
    // @Input() public element: any;
    // @Input() public componentPortal: any;

    @Input() public reorderable: any;
    @Input() public sortable: any;
    @Input() public totalItems: any;
    @Input() public dataSource: any;
    @Input() public sortedColumn: any;
    @Input() public trackBy: any;
    @Input() public headers: any;

    @Input() public hasVirtualScroll: boolean = false;

    private readonly defaultColumnAlignment: TableAlignmentOptions = "left";
    private formatters: {
        version: string;
        items: Record<string, ITableFormatterDefinition>;
    };

    constructor(
        private formattersRegistryService: TableFormatterRegistryService
    ) {}

    public columnTrackBy(
        index: number,
        item: ITableWidgetColumnConfig
    ): string {
        return item.id;
    }

    public onSortOrderChanged(event: any) {
        console.log("onSortOrderChanged", event);
    }

    public getColumnAlignment(
        column: ITableWidgetColumnConfig
    ): TableAlignmentOptions {
        // Note: In case we have provided formatters by old manner (via config)
        // we don't have to proceed with calculations
        if (
            !column?.formatter?.componentType ||
            this.formattersRegistryService.isEmpty
        ) {
            return this.defaultColumnAlignment;
        }

        // Note: We don't want to invoke getFormattersMap() on every change detection cycle
        // but only when it was changed
        if (
            this.formatters?.version !==
            this.formattersRegistryService.stateVersion
        ) {
            this.formatters = {
                // Transforming array into map
                items: this.formattersRegistryService.getItems().reduce(
                    (prev, next) => ({
                        ...prev,
                        [next.componentType]: next,
                    }),
                    {}
                ),
                version: this.formattersRegistryService.stateVersion,
            };
        }

        return (
            this.formatters.items[column.formatter.componentType]?.alignment ||
            this.defaultColumnAlignment
        );
    }
}
