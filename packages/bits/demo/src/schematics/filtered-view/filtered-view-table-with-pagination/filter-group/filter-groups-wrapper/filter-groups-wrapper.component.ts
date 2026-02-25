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

import { AfterViewInit, Component, ContentChildren, QueryList, inject } from "@angular/core";
import _isEmpty from "lodash/isEmpty";

import { DataSourceService, IFilteringParticipants } from "@nova-ui/bits";

import { FilterGroupComponent } from "../filter-group.component";

@Component({
    selector: "app-filter-groups-wrapper",
    templateUrl: "filter-groups-wrapper.component.html",
    styleUrls: ["filter-groups-wrapper.component.less"],
    standalone: false,
})
export class FilterGroupsWrapperComponent implements AfterViewInit {
    dataSourceService = inject<DataSourceService<any>>(DataSourceService);

    @ContentChildren(FilterGroupComponent)
    filterGroups: QueryList<FilterGroupComponent>;

    public i18nHiddenFiltersMapping: { [k: string]: string } = {
        "=1": $localize`1 hidden filter.`,
        other: $localize`# hidden filters.`,
    };

    public ngAfterViewInit(): void {
        this.dataSourceService.registerComponent(this.getFilterComponents());
        this.filterGroups.changes.subscribe(() => {
            this.dataSourceService.registerComponent(
                this.getFilterComponents()
            );
        });
    }

    public emptyFilterGroupsTitles(): string {
        return this.filterGroups
            .filter((filterGroup) =>
                _isEmpty(filterGroup.filterGroupItem.allFilterOptions)
            )
            .map((filterGroup) => filterGroup.filterGroupItem.title)
            .join(", ");
    }

    public emptyFilterGroupsExist(): boolean {
        return this.emptyFilterGroupsCount() > 0;
    }

    public emptyFilterGroupsCount(): number {
        return this.filterGroups.filter((filterGroup) =>
            _isEmpty(filterGroup.filterGroupItem.allFilterOptions)
        ).length;
    }

    private getFilterComponents(): IFilteringParticipants {
        return this.filterGroups.reduce(
            (obj: IFilteringParticipants, item: FilterGroupComponent) => {
                obj[item.filterGroupItem.id] = { componentInstance: item };
                return obj;
            },
            {}
        );
    }
}
