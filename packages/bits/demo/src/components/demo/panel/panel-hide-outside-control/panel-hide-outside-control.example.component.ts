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

import { ChangeDetectorRef, Component, Inject } from "@angular/core";

import { ToastService } from "@nova-ui/bits";

@Component({
    selector: "nui-panel-hide-outside-control-example",
    templateUrl: "./panel-hide-outside-control.example.component.html",
    standalone: false,
})
export class PanelHideOutsideControlExampleComponent {
    public isHidden = false;

    public hide(): void {
        this.isHidden = true;
        this.changeDetectorRef.detectChanges();
    }

    public reveal(): void {
        this.isHidden = false;
        this.changeDetectorRef.detectChanges();
    }

    public getHideStateChanged($event: boolean): void {
        this.isHidden = $event;
        this.toastService.info({
            message: this.isHidden ? $localize`Hidden` : $localize`Revealed`,
            title: $localize`Panel State`,
        });
    }

    constructor(
        @Inject(ToastService) private toastService: ToastService,
        private changeDetectorRef: ChangeDetectorRef
    ) {}
}
