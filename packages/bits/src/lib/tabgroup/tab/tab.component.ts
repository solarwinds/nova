import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    Output,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";

import { TabGroupComponent } from "../tab-group/tab-group.component";
/** @ignore */
@Component({
    selector: "nui-tab",
    template: `
        <div [hidden]="!active"><ng-content></ng-content></div>
        <ng-template *ngIf="active" [ngTemplateOutlet]="templateRef">
        </ng-template>
    `,
    encapsulation: ViewEncapsulation.None,
})
export class TabComponent {
    /** Tab header text */
    @Input() heading: string;
    /** If true tab can not be activated  */
    @Input() disabled: boolean;

    @Input() templateRef: TemplateRef<ElementRef>;

    /** Tab active state toggle */
    @Input()
    get active(): boolean {
        return this._active;
    }

    set active(active: boolean) {
        if (this._active === active) {
            return;
        }

        if ((this.disabled && active) || !active) {
            if (this._active && !active) {
                this.deselected.emit(this);
                this._active = active;
            }

            return;
        }

        this._active = active;
        this.selected.emit(this);
    }

    /** Event is fired when tab became active, $event:Tab equals to selected instance of Tab component */
    @Output() selected: EventEmitter<TabComponent> = new EventEmitter();
    /** Event is fired when tab became inactive, $event:Tab equals to deselected instance of Tab component */
    @Output() deselected: EventEmitter<TabComponent> = new EventEmitter();

    @HostBinding("class.tab-pane") addClass = true;

    public headingRef: TemplateRef<any>;
    protected _active: boolean;

    constructor(private tabGroup: TabGroupComponent) {
        this.tabGroup.addTab(this);
    }
}
