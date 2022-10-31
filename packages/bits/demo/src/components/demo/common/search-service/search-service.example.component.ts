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

import { Component, Inject } from "@angular/core";
import _includes from "lodash/includes";

import { ISearchService, SearchService } from "@nova-ui/bits";

@Component({
    selector: "nui-search-service-example",
    templateUrl: "./search-service.example.component.html",
})
export class SearchServiceExampleComponent {
    private now = new Date().getTime();
    private week = 7 * 24 * 60 * 60 * 1000; // milliseconds 7 * 24 * 60 * 60 * 1000
    public items = [
        {
            stringContainer: "abc",
            numberContainer: 123,
            dateContainer: new Date(this.now - this.week),
        },
        {
            stringContainer: "abcd",
            numberContainer: 1234,
            dateContainer: new Date(this.now),
        },
        {
            stringContainer: "abcde",
            numberContainer: 12345,
            dateContainer: new Date(this.now + this.week),
        },
    ];
    public itemsFormatted = JSON.stringify(this.items, null, 2);
    public searchResult: any;
    public searchResultFormatted: any;
    public searchValue: any;
    public props = ["stringContainer", "numberContainer", "dateContainer"];

    constructor(@Inject(SearchService) private searchService: ISearchService) {}

    public valuesChanged(values: any[]) {
        this.props = [...values];
    }

    public search() {
        const props = this.getProps();
        this.searchResult = this.searchService.search(
            this.items,
            props,
            this.searchValue
        );
        this.searchResultFormatted = JSON.stringify(this.searchResult, null, 2);
    }

    private getProps(): Array<string> {
        const props = [];
        if (_includes(this.props, "1")) {
            this.props = [];
            props.push("stringContainer");
        }
        if (_includes(this.props, "2")) {
            this.props = [];
            props.push("numberContainer");
        }
        if (_includes(this.props, "3")) {
            this.props = [];
            props.push("dateContainer");
        }

        return props;
    }
}
