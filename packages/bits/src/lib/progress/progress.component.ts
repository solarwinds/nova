// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    Output,
    TemplateRef,
    ViewEncapsulation,
} from "@angular/core";

/**
 * <example-url>./../examples/index.html#/progress</example-url>
 */
@Component({
    selector: "nui-progress",
    templateUrl: "./progress.component.html",
    styleUrls: ["./progress.component.less"],
    encapsulation: ViewEncapsulation.None,
    standalone: false
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

    public ngOnChanges(): void {
        this.isIndeterminate = this.percent === undefined;
    }

    public cancelProgress(): void {
        this.cancel.emit();
    }
}
