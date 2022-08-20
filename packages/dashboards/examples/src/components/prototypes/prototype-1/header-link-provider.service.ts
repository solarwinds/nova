import { Injectable, Optional } from "@angular/core";
import { IHeaderLinkProvider } from "@nova-ui/dashboards";
import { GlobalFilteringDataSource } from "./global-filtering-data.source";

@Injectable()
export class HeaderLinkProviderService implements IHeaderLinkProvider {
    public static providerId = "HeaderLinkProviderService";

    constructor(@Optional() private globalFilters: GlobalFilteringDataSource) {}

    public getLink(template: string): string {
        if (!this.globalFilters) {
            return template;
        }

        const filters = this.globalFilters.getFilters();

        // use global filter values as query parameters for the string
        const queryParams = Object.keys(filters)
            .map(
                (f) =>
                    encodeURIComponent(f) +
                    "=" +
                    encodeURIComponent(filters[f].data.value)
            )
            .join("&");

        return template + "/search?" + queryParams;
    }
}
