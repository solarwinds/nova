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

import { Injectable } from "@angular/core";
import isNil from "lodash/isNil";
import { debounceTime, takeUntil } from "rxjs/operators";

import { IFilter } from "@nova-ui/bits";

import { REFRESH } from "../../../services/types";
import { PizzagnaLayer } from "../../../types";
import { TableWidgetComponent } from "../public-api";

@Injectable()
export class SearchFeatureAddonService {
    private widget: TableWidgetComponent; // TODO: generic widget

    private searchDebounceTime = 500;

    public initWidget(widget: TableWidgetComponent) {
        this.widget = widget;
        this.initSearch();
    }

    private initSearch() {
        this.defineSearch();

        const dsFeaturesChange =
            this.widget.dataSource?.features?.featuresChanged;
        if (dsFeaturesChange) {
            dsFeaturesChange
                .pipe(takeUntil(this.widget.onDestroy$))
                .subscribe(() => {
                    this.defineSearch();
                });
        }
    }

    private registerSearch() {
        if (this.widget.dataSource) {
            this.widget.dataSource.registerComponent({
                search: {
                    componentInstance: {
                        getFilters: () =>
                            <IFilter<string>>{
                                type: "search",
                                value: this.widget.searchValue,
                            },
                    },
                },
            });
        }
    }

    private deregisterSearch() {
        if (this.widget.dataSource) {
            this.widget.dataSource.deregisterComponent?.("search");
        }
    }

    private defineSearch() {
        const searchConfiguration =
            this.widget.configuration?.searchConfiguration;
        const searchDsConfig =
            this.widget.dataSource.features?.getFeatureConfig("search");

        this.widget.isSearchEnabled = !!(
            searchConfiguration?.enabled && searchDsConfig?.enabled
        );

        if (this.widget.isSearchEnabled) {
            this.widget.searchValue = searchConfiguration?.searchTerm || "";
            this.registerSearch();
            this.searchDebounceTime = !isNil(
                searchConfiguration?.searchDebounce
            )
                ? // Note: asserting value to prevent compilation error on unable to infer correct type
                  (searchConfiguration?.searchDebounce as number)
                : this.searchDebounceTime;
            this.watchSearchTerm();
        } else {
            this.deregisterSearch();
        }
    }

    private watchSearchTerm() {
        this.widget.searchTerm$
            .pipe(
                debounceTime(this.searchDebounceTime),
                takeUntil(this.widget.onDestroy$)
            )
            .subscribe(() => {
                this.widget.pizzagnaService.setProperty(
                    {
                        pizzagnaKey: PizzagnaLayer.Configuration,
                        componentId: this.widget.componentId,
                        propertyPath: [
                            "configuration.searchConfiguration.searchTerm",
                        ],
                    },
                    this.widget.searchValue
                );
                this.widget.eventBus.getStream(REFRESH).next();
            });
    }
}
