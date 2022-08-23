import {
    AfterContentInit,
    ChangeDetectionStrategy,
    Component,
    ContentChildren,
    forwardRef,
    HostBinding,
    Inject,
    OnDestroy,
    Optional,
    QueryList,
} from "@angular/core";
import every from "lodash/every";
import { merge, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { NUI_SELECT_V2_OPTION_PARENT_COMPONENT } from "../constants";
import { SelectV2OptionComponent } from "../option/select-v2-option.component";
import { IOptionedComponent } from "../types";

/**
 * @ignore
 * Will be renamed in scope of the NUI-5797
 */
@Component({
    selector: "nui-select-v2-option-group",
    template: "<ng-content></ng-content>",
    styleUrls: ["./select-v2-option-group.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: { role: "group" },
})
export class SelectV2OptionGroupComponent
    implements AfterContentInit, OnDestroy
{
    /** Whether the Option Group outfiltered */
    @HostBinding("class.hidden")
    public outfiltered: boolean = false;

    @ContentChildren(forwardRef(() => SelectV2OptionComponent))
    private options: QueryList<SelectV2OptionComponent>;
    private select: IOptionedComponent;
    private onDestroy$ = new Subject();

    constructor(
        @Optional()
        @Inject(NUI_SELECT_V2_OPTION_PARENT_COMPONENT)
        parent: IOptionedComponent
    ) {
        this.select = parent;
    }

    ngAfterContentInit(): void {
        if (this.select.isTypeaheadEnabled) {
            merge([this.select.valueChanged, this.select.valueSelected])
                .pipe(takeUntil(this.onDestroy$))
                .subscribe(() => {
                    this.outfiltered = every(
                        this.options.toArray(),
                        (option: SelectV2OptionComponent) => option.outfiltered
                    );
                });
        }
    }

    ngOnDestroy(): void {
        this.onDestroy$.next();
        this.onDestroy$.complete();
    }
}
