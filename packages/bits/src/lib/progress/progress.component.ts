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
    @Input() public ariaLabel: string = "Progress bar";

    /**
     * Help template content displayed under the progress bar.
     * This can be used instead of the helpText string input for custom
     * help text styling.
     */
    @Input() helpTemplateRef: TemplateRef<any>;

    @Output() public cancel = new EventEmitter();

    public isIndeterminate = false;
    public ariaValueNow: string | undefined;

    public ngOnChanges() {
        this.isIndeterminate = this.percent === undefined;
    }

    public cancelProgress() {
        this.cancel.emit();
    }
}
