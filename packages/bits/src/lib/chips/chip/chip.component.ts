import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";

import { IChipsItem } from "../public-api";

/**
 * @ignore
 */
@Component({
    selector: "nui-chip",
    templateUrl: "./chip.component.html",
    styleUrls: ["./chip.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        class: "nui-chip",
        role: "listitem",
    },
})
export class ChipComponent implements AfterViewInit {
    /**
     * Value passed to display as a chip.
     */
    @Input() public item: IChipsItem;
    /**
     * Value passed to display a tooltip for the 'close' button
     */
    @Input() public closeButtonTooltip: string;

    /** Custom css class to be added to the chip element */
    @Input() public customClass:
        | string
        | string[]
        | Set<string>
        | { [klass: string]: any };

    /**
     * Event that is fired when single item is cleared (by clicking on remove icon).
     */
    @Output() public remove = new EventEmitter<any>();

    public isContentProjected: boolean;

    @ViewChild("projection") private contentTemplate: TemplateRef<any>;

    constructor(public host: ElementRef, private cdRef: ChangeDetectorRef) {}

    public ngAfterViewInit(): void {
        this.isContentProjected = Boolean(
            this.contentTemplate.createEmbeddedView(undefined).rootNodes.length
        );
        this.cdRef.detectChanges();
    }

    public onRemove() {
        this.remove.emit();
    }
}
