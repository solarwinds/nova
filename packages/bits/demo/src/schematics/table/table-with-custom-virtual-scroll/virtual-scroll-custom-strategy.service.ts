import { ListRange } from "@angular/cdk/collections";
import {
    Inject,
    Injectable,
} from "@angular/core";
import {
    IFilter,
    IFilterPub,
} from "@nova-ui/bits";

import { CUSTOM_SCROLL_ITEMS_PER_PAGE } from "./table-with-custom-virtual-scroll-data";

@Injectable()
export class VirtualScrollCustomStrategyService implements IFilterPub<IFilter<ListRange>> {
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

    public reset() {
        this.virtualScrollRange = { start: 0, end: this.itemsPerPage };
    }

    public prepareNextPage(fetchedItemsCount: number) {
        if (fetchedItemsCount < this.itemsPerPage) {
            // keep requesting the same page if not all expected items per page were loaded
        } else {
            // advances "pagination" to the next pages
            this.virtualScrollRange.start += this.itemsPerPage;
            this.virtualScrollRange.end = this.virtualScrollRange.start + this.itemsPerPage;
        }
    }
}
