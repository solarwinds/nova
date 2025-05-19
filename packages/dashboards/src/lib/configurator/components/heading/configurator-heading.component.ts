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
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    Output,
} from "@angular/core";

import { ConfiguratorHeadingService } from "../../services/configurator-heading.service";

@Component({
    selector: "nui-configurator-heading",
    templateUrl: "./configurator-heading.component.html",
    styleUrls: ["./configurator-heading.component.less"],
})
export class ConfiguratorHeadingComponent implements OnChanges {
    @Input() public configuratorTitle: string;
    @Input() public disableCloseButton = false;

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public close = new EventEmitter();

    constructor(
        public el: ElementRef,
        private heading: ConfiguratorHeadingService
    ) {}

    public ngOnChanges(): void {
        this.heading.height$.next(
            +getComputedStyle(this.el.nativeElement).height.slice(0, -2)
        );
    }
}
