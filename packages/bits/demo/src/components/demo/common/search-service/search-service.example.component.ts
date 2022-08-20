import { Component, Inject } from "@angular/core";
import { ISearchService, SearchService } from "@nova-ui/bits";
import _includes from "lodash/includes";

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
