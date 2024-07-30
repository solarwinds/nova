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
import { INovaFilteringOutputs, ISelectChangedEvent } from "@nova-ui/bits";
import { IPaginatorState, TableWidgetComponent } from "../public-api";

@Injectable()
export class PaginatorFeatureAddonService {
    private widget: TableWidgetComponent; // TODO: generic widget

    public defaultPaginatorState: IPaginatorState = {
        page: 1,
        pageSize: 10,
        pageSizeSet: [10, 20, 50],
        total: 0,
    };
    public paginatorState: IPaginatorState = this.defaultPaginatorState;

    public initPaginator(widget: TableWidgetComponent): void {
        this.widget = widget;
        this.setPaginatorState();
    }

    public applyFilters(): void {
        this.widget.dataSource.applyFilters();
    }

    private registerPaginator() {
        if (this.widget.dataSource) {
            this.widget.dataSource.registerComponent({
                paginator: {
                    componentInstance: this.widget.paginator,
                },
            });
        }
    }

    private deregisterPaginator() {
        if (this.widget.dataSource) {
            this.widget.dataSource.deregisterComponent?.("paginator");
        }
    }

    private setPaginatorState() {
        const paginatorConfiguration =
            this.widget.configuration?.paginatorConfiguration;

        if (this.widget.hasPaginator) {
            this.paginatorState.pageSize =
                paginatorConfiguration?.pageSize ??
                this.defaultPaginatorState.pageSize;

            this.paginatorState.pageSizeSet =
                paginatorConfiguration?.pageSizeSet ??
                this.defaultPaginatorState.pageSizeSet;

            this.widget.dataSource.outputsSubject.subscribe(
                (data: INovaFilteringOutputs) => {
                    this.paginatorState.total = data.paginator?.total ?? 0;
                }
            );

            // When changing page size from configurator, this will force preview update
            if (this.widget.paginator) {
                const pageSize: ISelectChangedEvent<number> = {
                    oldValue: 0,
                    newValue: this.paginatorState.pageSize,
                };
                this.widget.paginator.setItemsPerPage(pageSize);
            }

            this.registerPaginator();
        } else {
            this.deregisterPaginator();
        }
    }
}
