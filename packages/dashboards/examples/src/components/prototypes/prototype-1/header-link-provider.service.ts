import { Injectable, Optional } from "@angular/core";
import { IHeaderLinkProvider } from "@nova-ui/dashboards";
import { GlobalFilteringDataSource } from "./global-filtering-data.source";

@Injectable()
export class HeaderLinkProvider implements IHeaderLinkProvider {
    public static providerId = "HeaderLinkProvider";

    constructor(@Optional() private globalFilters: GlobalFilteringDataSource) {
    }

    public getLink(template: string): string {
        if (!this.globalFilters) {
            return template;
        }

        const filters = this.globalFilters.getFilters();

        // use global filter values as query parameters for the string
        const queryParams = Object.keys(filters)
            .map(f => encodeURIComponent(f) + "=" +  encodeURIComponent(filters[f].value.value))
            .join("&");

        const url = template + "/search?" + queryParams;
        console.log(url);
        return url;
    }

}
