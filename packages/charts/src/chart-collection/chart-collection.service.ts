import { Injectable } from "@angular/core";
import isUndefined from "lodash/isUndefined";

import { ChartCollection } from "../core/chart-collection";

/**
 * This service registers collections of charts identified by given id. It is used primarily by the ChartCollectionId directive.
 */
@Injectable()
export class ChartCollectionService {

    private collections: { [key: string]: ChartCollection } = {};

    public getChartCollection(collectionId: string) {
        let collection = this.collections[collectionId];
        if (isUndefined(collection)) {
            collection = new ChartCollection();
            this.collections[collectionId] = collection;
        }
        return collection;
    }

}
