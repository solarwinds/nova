import {
    AfterContentInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";

import { expand } from "../../animations/expand";

/**
 * <example-url>./../examples/index.html#/expander</example-url>
 */
@Component({
    selector: "nui-expander",
    templateUrl: "./expander.component.html",
    animations: [expand],
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
            if (value) {
                this.renderBody = true;
            }
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
    public renderBody: boolean = false;
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

    public expandedStateDone(): void {
        if (!this.open) {
            this.renderBody = false;
        }
    }

    public getIconColor(): string {
        return this.disabled ? "gray" : "primary-blue";
    }
}
