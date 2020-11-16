import {
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostBinding,
    Input,
    Output,
} from "@angular/core";

/** @ignore */

@Component({
    selector: "nui-tab-heading",
    templateUrl: "./tab-heading.component.html",
    styleUrls: ["./tab-heading.component.less"],
})

export class TabHeadingComponent {
    /** This adds 'disabled' class to the host component depending on the 'disabled' @Input to properly style disabled tabs */
    @HostBinding("class.disabled") get isDisabled() { return this.disabled; }

    /** If true tab can not be activated  */
    @Input() disabled: boolean;

    /** Tab active state toggle */
    @Input() set active(isActive: boolean) {
        this._active = isActive;
        this.changeDetector.detectChanges();
    }

    get active() {
        return this._active;
    }

    /** Tab id **/
    @Input() tabId: string;

    /** Event is fired when tab became active, $event:Tab equals to selected instance of Tab component */
    @Output() selected: EventEmitter<TabHeadingComponent> = new EventEmitter();

    protected _active: boolean;

    constructor(private changeDetector: ChangeDetectorRef) {}

    public selectTab(): void {
        this.selected.emit(this);
    }
}
