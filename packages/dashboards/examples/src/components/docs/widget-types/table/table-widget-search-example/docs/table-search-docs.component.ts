import { Component } from "@angular/core";

@Component({
    selector: "nui-table-search-docs",
    templateUrl: "./table-search-docs.component.html",
})
export class TableSearchDocsComponent {
    public featuredDeclaredText = `
        private supportedFeatures: IDataSourceFeatures = {
        search: { enabled: true },
        pagination: { enabled: true },
    };`;
    public featuresUsedText = `
        this.features = new DataSourceFeatures(this.supportedFeatures);
    `;
    public tableConfigurationText = `
        "table": {
            ...
            properties: {
                configuration: {
                    // define search configuration here
                    searchConfiguration: {
                        enabled: true,
                        // following optional properties below can be configured as well
                        // searchTerm: "search criteria here",
                        // searchDebounce: 300,
                    },
                } as ITableWidgetConfig,
            },
        },
    `;
}
