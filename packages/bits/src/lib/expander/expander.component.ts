import {
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { expandV2 } from "../../animations/expand";
import { KEYBOARD_CODE } from "../../constants";

/**
 * <example-url>./../examples/index.html#/expander</example-url>
 */
@Component({
    selector: "nui-expander",
    templateUrl: "./expander.component.html",
    animations: [expandV2],
    styleUrls: ["./expander.component.less"],
    encapsulation: ViewEncapsulation.None,
})
export class ExpanderComponent implements AfterContentInit {
    /**
     * Adds "disabled" attribute to expander
     */
    @Input() disabled: boolean = false;
    /**
     * Adds icon to expander's header
     */
    @Input() icon: string = "";
    /**
     * Adds title to expander's header
     */
    @Input() header: string = "";
    /**
     * Hides left dotted border of expander.
     */
    @Input() hideLeftBorder: boolean = false;
    /**
     * Use this to have expander opened by default.
     */
    @Input() set open(value: boolean) {
        const previousValue: boolean = this.state === "expanded";
        if (previousValue !== value) {
            this.state = value ? "expanded" : "collapsed";
        }
    }

    get open(): boolean {
        return this.state === "expanded";
    }
    /**
     * Is emitted when expander is expanded/collapsed
     */
    @Output() openChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @ViewChild("customHeaderContent", {static: true})
    public customHeaderContent: ElementRef;

    public state: "expanded" | "collapsed" = "collapsed";
    public isCustomHeaderContentEmpty: boolean = false;

    constructor(private cdRef: ChangeDetectorRef) {}

    ngAfterContentInit(): void {
        this.isCustomHeaderContentEmpty = this.customHeaderContent.nativeElement.childNodes.length === 0;
    }

    public toggle(): void {
        if (!this.disabled) {
            this.open = !this.open;
            this.openChange.emit(this.open);
            this.cdRef.detectChanges();
        }
    }

    public getIconColor(): string {
        return this.disabled ? "gray" : "primary-blue";
    }

    public onKeyDown(event: KeyboardEvent): void {
        if (event.code === KEYBOARD_CODE.SPACE || event.code === KEYBOARD_CODE.ENTER) {
            event.preventDefault();
            this.toggle();
        }
    }
}
