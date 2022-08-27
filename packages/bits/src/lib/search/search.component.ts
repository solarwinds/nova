import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    Output,
    ViewEncapsulation,
} from "@angular/core";
import _isEmpty from "lodash/isEmpty";
import { Subject } from "rxjs";

import { IFilter, IFilterPub } from "../../services/data-source/public-api";

@Component({
    selector: "nui-search",
    host: {
        class: "nui-search",
        role: "search",
    },
    templateUrl: "./search.component.html",
    styleUrls: ["./search.component.less"],
    encapsulation: ViewEncapsulation.None,
})

// <example-url>./../examples/index.html#/search</example-url>

/**
 * Search component provides input box with 'search' and 'cancel' buttons on the right side of the box.
 * Handles setting focus to its inner input fields on cancel.
 * Fires 'search', 'cancel', 'inputChanged' and 'focusChange' events.
 * Indicates spinner to the left of input text depending on 'busy' property.
 */
export class SearchComponent implements IFilterPub, OnDestroy {
    // mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
    // before any new search is performed
    public detectFilterChanges = true;

    /**
     * default text of placeholder if no custom ones is provided
     */
    public defaultPlaceholder: string;

    /** @ignore */
    public onDestroy$ = new Subject<void>();

    /**
     * Controls focus of input field (true means focused).
     */
    @Input() captureFocus: boolean;
    /**
     * Name of input the element.
     */
    @Input() name: string;
    /**
     * A string that will be placed as a watermark inside of the search when it's empty.
     */
    @Input() placeholder: string;
    /**
     * Initial value of input field.
     */
    @Input() value: string;
    /**
     * Event fired on each 'cancel' button click. Emits empty string.
     */
    @Output() public cancel = new EventEmitter<string>();
    /**
     * Event fired on external focus changes (e.g. initiated by user via UI).
     * Use it if you bind an external input to 'captureFocus' property for matching them both.
     */
    @Output() public focusChange = new EventEmitter<boolean>();
    /**
     * Event fired when input field value is changed (via either keyboard or typeahead select item).
     * Pay attention, that host property bound to 'value' is not being changed by component on this event,
     * it is the responsibility of host component. The same with clearing of 'busy' status - if you want
     * to clear it on inputChange - handle it in host component
     */
    @Output() public inputChange = new EventEmitter<string>();
    /**
     * Event fired on 'search' button click or 'ENTER' key pressed
     */
    @Output() public search = new EventEmitter<string>();

    public searchIconColor: string = "gray";

    constructor() {
        this.defaultPlaceholder = $localize`Search`;
    }

    public getFilters(): IFilter<string> {
        return {
            type: "string",
            value: this.value,
        };
    }

    public getPlaceholder(): string {
        return this.placeholder || this.defaultPlaceholder + "...";
    }

    public onCancel(): void {
        this.value = "";
        this.cancel.emit(this.value);
        this.captureFocus = true;
        this.focusChange.emit(true);
    }

    public onFocusChange(event: boolean) {
        this.captureFocus = event;
        this.focusChange.emit(event);
    }

    public onInputChange(): void {
        this.inputChange.emit(this.value);
    }

    public onKeyup(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.onSearch();
        }
    }

    public isButtonDisabled() {
        return _isEmpty(this.value);
    }

    public onSearch(): void {
        this.search.emit(this.value);
    }

    ngOnDestroy() {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
