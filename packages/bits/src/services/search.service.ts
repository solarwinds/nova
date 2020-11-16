import { DatePipe } from "@angular/common";
import { Injectable } from "@angular/core";
import has from "lodash/has";
import isArray from "lodash/isArray";
import isDate from "lodash/isDate";
import isEmpty from "lodash/isEmpty";
import isNumber from "lodash/isNumber";
import isString from "lodash/isString";
import isUndefined from "lodash/isUndefined";
import keys from "lodash/keys";
import startsWith from "lodash/startsWith";

import { LoggerService } from "./log-service";
import { ISearchService } from "./public-api";

/**
 * <example-url>./../examples/index.html#/common/search-service</example-url>
 */

/**
 *  Service that provides searching algorithms.
 *
 * __Name :__
 * Search service
 *
 */
/**
 * @ignore
 */
@Injectable({providedIn: "root"})
export class SearchService implements ISearchService {
    /**
     *  __Description :__
     * Search the value on the items within the given properties.
     *
     * __Parameters :__
     *
     * {any[]} items Items to search within.
     *
     *  {string[]} properties Properties where the search is applied. If no property specified, search is
     *  applied on all fields.
     *
     *  {string|number|date} searchValue The searched value that is used as a string or string fragment. Empty
     *  string returns the whole array.
     *
     *  {string} [dateFormat="mediumDate"] The Angular date format that is used for searching on Date type
     *  properties.
     *
     *  return {any[]} Items resulted after the search.
     *
     */
    constructor(private logger: LoggerService,
                private datePipe: DatePipe) {}

    public search = (items: any[], properties: string[], searchValue: any, dateFormat?: string): any[] => {
        // TODO: in case of interest, create options as object, put dateFormat in, put caseSensitive in
        if (!isArray(items)) {
            this.logger.error("nuiSearchService needs items parameter as an Array");
        }
        if (!isArray(properties)) {
            this.logger.error("nuiSearchService needs properties parameter as an Array");
        }
        if (isEmpty(properties)) {
            properties = this.getSearchableColumns(items);
            this.logger.warn("No properties specified to search on, so all of the fields will be used");
        }
        if (isUndefined(searchValue)) {
            this.logger.warn("No searchValue specified to search by, the whole list will be the result");
            return items;
        }

        return this.filterResults(items, properties, searchValue, dateFormat);
    }

    protected filterResults(items: any[], properties: string[], searchValue: any, dateFormat?: string) {
        return items.filter((item) => {
            if (isString(item) || isNumber(item)) {
                return this.filterPredicate(item, searchValue);
            }
            for (const prop of properties) {
                let value = has(item, prop) ? item[prop] : item;

                if (isDate(value)) {
                    value = this.transformDate(value, dateFormat);
                }
                if (isDate(searchValue)) {
                    searchValue = this.transformDate(searchValue, dateFormat);
                }
                if (value && this.filterPredicate(value, searchValue)) {
                    return true;
                }
            }
        });
    }

    protected transformDate(value: Date, dateFormat: string | undefined): string | null {
        return this.datePipe.transform(value, dateFormat);
    }

    protected filterPredicate(item: any, searchValue: any) {
        return item.toString().toLowerCase().indexOf(searchValue.toString().toLowerCase()) !== -1;
    }

    protected getSearchableColumns = (items: any[]): string[] => {
        const props: {[key: string]: boolean} = {};
        for (const item of items) {
            keys(item).map((key: any) => {
                if (!startsWith(key, "$")) {
                    props[key] = true;
                }
            });
        }
        return keys(props);
    }
}
