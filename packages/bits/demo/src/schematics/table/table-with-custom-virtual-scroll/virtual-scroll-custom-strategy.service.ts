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

import { ListRange } from "@angular/cdk/collections";
import { Inject, Injectable } from "@angular/core";

import { IFilter, IFilterPub } from "@nova-ui/bits";

import { CUSTOM_SCROLL_ITEMS_PER_PAGE } from "./table-with-custom-virtual-scroll-data";

@Injectable()
export class VirtualScrollCustomStrategyService
    implements IFilterPub<IFilter<ListRange>>
{
    public itemsPerPage: number;

    protected virtualScrollRange: ListRange;

    constructor(@Inject(CUSTOM_SCROLL_ITEMS_PER_PAGE) itemsPerPage: number) {
        this.itemsPerPage = itemsPerPage;
        this.reset();
    }

    public getFilters(): IFilter<ListRange> {
        return {
            type: "virtualScroll",
            value: this.virtualScrollRange,
        };
    }

    public reset(): void {
        this.virtualScrollRange = { start: 0, end: this.itemsPerPage };
    }

    public prepareNextPage(fetchedItemsCount: number): void {
        if (fetchedItemsCount < this.itemsPerPage) {
            // keep requesting the same page if not all expected items per page were loaded
        } else {
            // advances "pagination" to the next pages
            this.virtualScrollRange.start += this.itemsPerPage;
            this.virtualScrollRange.end =
                this.virtualScrollRange.start + this.itemsPerPage;
        }
    }
}
