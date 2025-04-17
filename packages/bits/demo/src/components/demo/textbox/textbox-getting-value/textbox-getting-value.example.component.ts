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
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ViewChild,
} from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil, tap } from "rxjs/operators";

import { TextboxComponent } from "@nova-ui/bits";

@Component({
    selector: "nui-textbox-getting-value-example",
    templateUrl: "./textbox-getting-value.example.component.html",
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class TextboxGettingValueExampleComponent implements AfterViewInit {
    public textboxValueChangedValue: string | number;
    private destroy$: Subject<any> = new Subject<any>();

    @ViewChild("textboxValueChangedExample") textbox: TextboxComponent;

    public ngAfterViewInit(): void {
        this.textbox.textChange
            .pipe(
                tap(
                    (value) => (this.textboxValueChangedValue = value as string)
                ),
                takeUntil(this.destroy$)
            )
            .subscribe();
    }
}
