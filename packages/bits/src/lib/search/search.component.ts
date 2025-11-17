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
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
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
export class SearchComponent implements IFilterPub, OnDestroy, OnInit {
    /* --------------------------------------------------
       Static / internal constants
    -------------------------------------------------- */
    private static nextUniqueId = 0; // counter for generated input ids

    /* --------------------------------------------------
       Public configuration Inputs (external API)
    -------------------------------------------------- */
    /** Focus control (true means input should receive focus). */
    @Input() captureFocus: boolean;
    /** Input name attribute (useful for forms). */
    @Input() name: string;
    /** Applies error state styles when true. */
    @Input() isInErrorState: boolean = false;
    /** Watermark text (placeholder) displayed when empty. */
    @Input() placeholder: string;
    /** Custom id for the input. */
    @Input() inputId: string = "search input";
    /** Initial value of the input field. */
    @Input() value: string;

    /* --------------------------------------------------
       Public Outputs (events)
    -------------------------------------------------- */
    /** Emits empty string on cancel action. */
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
    /** Emits current value when search triggered (button or Enter). */
    @Output() public search = new EventEmitter<string>();

    /* --------------------------------------------------
       Internal state / derived values
    -------------------------------------------------- */
    /**
     * Flag indicating whether to detect filter changes.
     * Mark this filter to be monitored by our datasource for any changes in order reset other filters(eg: pagination)
     * before any new search is performed
     */
    public detectFilterChanges = true;
    /** Default placeholder text fallback. */
    public defaultPlaceholder: string;
    /** Teardown subject for subscriptions. */
    /** @ignore */
    public onDestroy$ = new Subject<void>();
    /** Styling hook for icon color. */
    public searchIconColor: string = "gray";
    /** Resolved input id (provided or generated). */
    public resolvedInputId: string;
    /** Accessible label text for the input (used by hidden label). */
    public inputAriaLabel: string;
    /** Accessible label for the cancel (clear) button. */
    public cancelAriaLabel: string;
    /** Accessible label for the submit (search) button. */
    public submitAriaLabel: string;

    /* --------------------------------------------------
       Constructor & lifecycle hooks
    -------------------------------------------------- */
    constructor() {
        this.defaultPlaceholder = $localize`Search`;
        this.inputAriaLabel = $localize`Search`;
        this.cancelAriaLabel = $localize`Cancel search`;
        this.submitAriaLabel = $localize`Submit search`;
    }
    public ngOnInit(): void {
        this.resolvedInputId =
            `nui-search-input-${SearchComponent.nextUniqueId++}` ||
            this.inputId;
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

    public onFocusChange(event: boolean): void {
        this.captureFocus = event;
        this.focusChange.emit(event);
    }

    public onInputChange(): void {
        this.inputChange.emit(this.value);
    }

    public onKeyup(event: KeyboardEvent): void {
        if (event.key === "Enter") {
            this.onSearch();
        } else if (event.key === "Escape" || event.key === "Esc") {
            this.onCancel();
        }
    }

    public isButtonDisabled(): boolean {
        return _isEmpty(this.value);
    }

    public onSearch(): void {
        this.search.emit(this.value);
    }

    /* --------------------------------------------------
       Lifecycle teardown
    -------------------------------------------------- */
    public ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
