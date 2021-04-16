import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    Output,
    ViewChild,
} from "@angular/core";

/** @ignore */

@Component({
    selector: "nui-tab-heading",
    templateUrl: "./tab-heading.component.html",
    styleUrls: ["./tab-heading.component.less"],
    host: { "role": "tab" },
})

export class TabHeadingComponent {
    protected _active: boolean;

    /** This adds 'disabled' class to the host component depending on the 'disabled' @Input to properly style disabled tabs */
    @HostBinding("class.disabled") get isDisabled() { return this.disabled; }

    /** If true tab can not be activated  */
    @Input() disabled: boolean;

    /** Tab active state toggle */
    @Input() set active(isActive: boolean) {
        this._active = isActive;
        this.changeDetector.detectChanges();
    }

    /** Tab id */
    @Input() tabId: string;

    /** Event is fired when tab became active, $event:Tab equals to selected instance of Tab component */
    @Output() selected: EventEmitter<TabHeadingComponent> = new EventEmitter();

    @ViewChild("tab") tabEl: ElementRef<HTMLElement>;

    @HostListener("keydown", ["$event"])
    onKeyDown(event: KeyboardEvent): void {
        const { code } = event;

        if(code === "Enter" || code === "Space"){
            if (document.activeElement === this.tabEl.nativeElement) {
                event.preventDefault();
                this.selectTab();
            }
        }
    }

    // eslint-disable-next-line @typescript-eslint/adjacent-overload-signatures
    get active() {
        return this._active;
    }

    constructor(private changeDetector: ChangeDetectorRef) {}

    public selectTab(): void {
        this.selected.emit(this);
    }
}
