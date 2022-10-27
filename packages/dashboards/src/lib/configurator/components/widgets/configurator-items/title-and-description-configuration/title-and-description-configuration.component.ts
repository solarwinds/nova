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
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { LoggerService } from "@nova-ui/bits";

import { IHasChangeDetector, IHasForm } from "../../../../../types";

@Component({
    selector: "nui-title-and-description-configuration",
    templateUrl: "./title-and-description-configuration.component.html",
    styleUrls: ["title-and-description-configuration.component.less"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleAndDescriptionConfigurationComponent
    implements IHasChangeDetector, IHasForm, OnInit, OnChanges
{
    public static lateLoadKey = "TitleAndDescriptionConfigurationComponent";

    @Input() title: string;
    @Input() url: string;
    @Input() subtitle: string;
    @Input() description: string;
    @Input() collapsible: boolean;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private logger: LoggerService
    ) {
        this.form = this.formBuilder.group({
            title: ["", Validators.required],
            subtitle: [""],
            url: [""],
            description: [""],
            collapsible: [false],
            collapsed: [true], // setting 'collapsed' to true to demonstrate the collapsed appearance in the preview
        });
    }

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.title) {
            this.form.get("title")?.setValue(this.title);
        }
        if (changes.url) {
            this.form.get("url")?.setValue(this.url);
        }
        if (changes.subtitle) {
            this.form.get("subtitle")?.setValue(this.subtitle);
        }
        if (changes.description) {
            this.form.get("description")?.setValue(this.description);
        }
        if (changes.collapsible) {
            this.form.get("collapsible")?.setValue(this.collapsible);
        }
    }

    public getSecondaryText() {
        const forTitle =
            this.form.controls["title"].value || $localize`No title`;
        const forSubtitle =
            this.form.controls["subtitle"].value || $localize`no subtitle`;
        return `${forTitle}, ${forSubtitle}`;
    }
}
