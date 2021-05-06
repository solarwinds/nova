import { OverlayConfig } from "@angular/cdk/overlay";
import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

import { IFilter, IFilterPub, ISelectorFilter } from "../../services/data-source/public-api";
import { CheckboxComponent } from "../checkbox/checkbox.component";
import { CheckboxChangeEvent } from "../checkbox/public-api";
import { IMenuGroup, IMenuItem } from "../menu/public-api";
import { OVERLAY_WITH_POPUP_STYLES_CLASS } from "../overlay/constants";
import { OverlayComponent } from "../overlay/overlay-component/overlay.component";

import { CheckboxStatus, SelectionType } from "./public-api";

/**
 * @ignore
 * <example-url>./../examples/index.html#/selector</example-url>
 */

/**
 * __Name :__
 * NUI Selector component.
 *
 * __Usage :__
 * Component provides different options to select elements
 * by emmiting appropriate event.
 * Checkbox and droplist allow to select "All" or "None" items.
 * Droplist has additional option to select "All pages". Component
 * has indication about which selection option is active now and
 * binding property to set indeterminate state.
 */
@Component({
    selector: "nui-selector",
    host: {
        "class": "nui-selector",
        "tabindex": "-1",
        "[attr.aria-label]": "ariaLabel",
    },
    templateUrl: "./selector.component.html",
    styleUrls: ["./selector.component.less"],
    encapsulation: ViewEncapsulation.None,
})

export class SelectorComponent implements OnChanges, AfterViewInit, OnDestroy, IFilterPub {
    /**
     * resets selection, makes component appearance indeterminate
     */
    @Input()
    public checkboxStatus: CheckboxStatus;

    @Input()
    public items: IMenuGroup[];

    @Input()
    public appendToBody: boolean;

    @Input()
    public ariaLabel: string = "Selector";

    @Output()
    public selectionChange = new EventEmitter<SelectionType>();

    @ViewChild("checkbox")
    public checkbox: CheckboxComponent;

    @ViewChild("popupArea", {static: true}) popupArea: ElementRef;

    @ViewChild(OverlayComponent) public overlay: OverlayComponent;

    public customContainer: ElementRef | undefined;
    public checkboxChecked = false;
    public indeterminate = false;
    public onDestroy$ = new Subject<void>();
    public overlayConfig: OverlayConfig = {
        panelClass: [OVERLAY_WITH_POPUP_STYLES_CLASS],
    };

    private status: SelectionType;

    private selectionHasChanged = false;

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes["checkboxStatus"]) {
            const checkboxStatus = changes["checkboxStatus"].currentValue;
            this.indeterminate = checkboxStatus === CheckboxStatus.Indeterminate;
            this.checkboxChecked = checkboxStatus === CheckboxStatus.Checked;
        }
        if (changes.appendToBody) {
            this.customContainer = changes.appendToBody.currentValue ? undefined : this.popupArea;
        }
    }

    public ngAfterViewInit(): void {
        const debounceTimeValue = 10;

        this.checkbox.valueChange.pipe(debounceTime(debounceTimeValue))
            .subscribe(this.onCheckboxValueChange.bind(this));
        this.overlay.clickOutside
            .pipe(takeUntil(this.onDestroy$))
            .subscribe(_ => this.overlay.hide());
        // TODO: should change programmatically in scope of NUI-5937
        this.checkbox.checkboxLabel.nativeElement.setAttribute("tabindex", "-1");
    }

    public ngOnDestroy(): void {
        this.checkbox.valueChange.unsubscribe();
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }

    public getFilters(): IFilter<ISelectorFilter> {
        const response = {
            type: "selector",
            value: {
                selectorState: {
                    checkboxStatus: this.checkboxStatus,
                    selectorItems: this.items,
                },
                status: this.status,
                selectionHasChanged: this.selectionHasChanged,
            },
        };
        this.selectionHasChanged = false;

        return response;
    }

    public handleSelectorClick(event: MouseEvent): void {
        if (event.currentTarget !== event.target) {
            return;
        }

        this.indeterminate = false;
        this.checkboxChecked = !this.checkboxChecked;

        const selection = this.checkboxChecked ? SelectionType.All : SelectionType.None;
        this.status = selection;

        this.selectionChange.emit(selection);
    }

    private onCheckboxValueChange(event: CheckboxChangeEvent): void {
        this.indeterminate = false;
        this.checkboxChecked = !this.checkboxChecked;

        this.status = this.checkboxChecked ? SelectionType.All : SelectionType.None;

        this.selectionHasChanged = true;

        if (event.target.checked) {
            // gives control to "selectionChange" stream
            this.selectionChange.emit(SelectionType.All);
        } else {
            // gives control to "selectionChange" stream
            this.selectionChange.emit(SelectionType.UnselectAll);
        }
    }

    public handleItemClick(item: IMenuItem): void {
        const selection = item.value || item.title as SelectionType;
        this.checkboxChecked = selection === SelectionType.All || selection === SelectionType.AllPages;
        this.status = selection;

        this.selectionHasChanged = true;

        // propagate selection
        this.selectionChange.emit(selection);
    }

}
