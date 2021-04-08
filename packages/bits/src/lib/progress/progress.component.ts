import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewEncapsulation
} from "@angular/core";

/**
 * <example-url>./../examples/index.html#/progress</example-url>
 */
@Component({
    selector: "nui-progress",
    templateUrl: "./progress.component.html",
    styleUrls: ["./progress.component.less"],
    encapsulation: ViewEncapsulation.None,
    host: {
        "role": "progressbar",
        "[attr.aria-label]": "ariaLabel + ' progress'",
     },
})
export class ProgressComponent implements OnChanges {
    @Input() public show: boolean;
    @Input() public showProgress = true;
    @Input() public message: string;
    @Input() public showNumber: boolean;
    @Input() public percent: number;
    @Input() public allowCancel: boolean;
    @Input() public cancelText: string;
    @Input() public helpText?: string;
    @Input() public stacked: boolean;
    @Input() public compactMode: boolean;

    /**
     * Input to set aria label text
     */
    @Input() public ariaLabel: string = "";

    /**
     * Help template content displayed under the progress bar.
     * This can be used instead of the helpText string input for custom
     * help text styling.
     */
    @Input() helpTemplateRef: TemplateRef<any>;

    @Output() public cancel = new EventEmitter();

    public isIndeterminate = false;

    public ngOnChanges() {
        this.isIndeterminate = this.percent === undefined;
    }

    public cancelProgress() {
        this.cancel.emit();
    }
}
