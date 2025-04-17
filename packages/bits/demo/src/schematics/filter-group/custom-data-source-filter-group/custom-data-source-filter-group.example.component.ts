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

import {
    AfterViewInit,
    Component,
    Inject,
    OnDestroy,
    QueryList,
    ViewChildren,
} from "@angular/core";
import _get from "lodash/get";
import _isEmpty from "lodash/isEmpty";
import { Subscription } from "rxjs";

import {
    DataSourceService,
    IFilteringParticipants,
    INovaFilteringOutputs,
} from "@nova-ui/bits";

import { CustomDataSourceFilterGroupCompositeComponent } from "./custom-data-source-filter-group.component";
import { FilterGroupCustomDataSourceService } from "./custom-data-source.service";
import { ICustomDSFilteredData, IFilterGroupItem } from "./public-api";

@Component({
    selector: "app-custom-data-source-filter-group-composite-example",
    templateUrl: "custom-data-source-filter-group.example.component.html",
    providers: [
        {
            provide: DataSourceService,
            useClass: FilterGroupCustomDataSourceService,
        },
    ],
    standalone: false
})
export class CustomDataSourceFilterGroupExampleComponent
    implements AfterViewInit, OnDestroy
{
    @ViewChildren(CustomDataSourceFilterGroupCompositeComponent)
    filterGroups: QueryList<CustomDataSourceFilterGroupCompositeComponent>;

    public filterGroupItems?: Array<IFilterGroupItem> = [];
    public filteringState?: INovaFilteringOutputs = {
        repeat: {
            itemsSource: [],
        },
        color: [],
        status: [],
    };
    private filterGroupSubscriptions: Array<Subscription> = [];

    constructor(
        @Inject(DataSourceService)
        private filterGroupCustomDataSourceService: FilterGroupCustomDataSourceService
    ) {}

    public ngAfterViewInit(): void {
        this.filterGroupSubscriptions.push(
            this.filterGroupCustomDataSourceService.outputsSubject.subscribe(
                (filteredData: ICustomDSFilteredData) => {
                    this.filterGroupItems = filteredData.filterGroupItems;
                    this.filteringState = filteredData.filteringState;
                }
            )
        );

        this.filterGroupSubscriptions.push(
            this.filterGroups.changes.subscribe(() => {
                this.filterGroupCustomDataSourceService.registerComponent(
                    this.getFilterComponents()
                );
            })
        );
        this.filterGroupCustomDataSourceService.applyFilters();
    }

    public changeFilters(event: IFilterGroupItem): void {
        this.filterGroupCustomDataSourceService.applyFilters();
    }

    public hasItems(): boolean {
        return !_isEmpty(_get(this, "filteringState.repeat.itemsSource"));
    }

    private getFilterComponents(): IFilteringParticipants {
        return this.filterGroups.reduce(
            (
                obj: IFilteringParticipants,
                item: CustomDataSourceFilterGroupCompositeComponent
            ) => {
                obj[item.filterGroupItem.id] = { componentInstance: item };
                return obj;
            },
            {}
        );
    }

    public ngOnDestroy(): void {
        this.filterGroupSubscriptions.forEach((subscription) =>
            subscription.unsubscribe()
        );
    }
}
