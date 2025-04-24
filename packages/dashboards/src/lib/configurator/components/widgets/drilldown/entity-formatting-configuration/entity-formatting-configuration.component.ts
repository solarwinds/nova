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
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
    selector: "nui-entity-formatting-configuration",
    templateUrl: "./entity-formatting-configuration.component.html",
    styles: [
        `
            .entity-formatting__accordion-content {
                padding: 15px 15px 15px 46px;
            }
        `,
    ],
    standalone: false,
})
export class EntityFormattingConfigurationComponent
    implements OnInit, OnChanges
{
    public static lateLoadKey = "EntityFormattingComponent";

    @Input() mappingKeys: string[];
    @Input() dataFieldIds: { [key: string]: string };

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup = this.formBuilder.group({
        dataFieldIds: this.formBuilder.group({
            icon: "",
            status: "",
            detailedUrl: "",
            label: "",
            url: "",
        }),
    });

    constructor(
        public changeDetector: ChangeDetectorRef,
        private formBuilder: FormBuilder
    ) {}

    public ngOnInit(): void {
        this.formReady.emit(this.form);
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.dataFieldIds) {
            this.getFieldMappingsControl.setValue(
                changes.dataFieldIds.currentValue
            );
        }
    }

    public get getFieldMappingsControl(): FormGroup {
        return this.form.get("dataFieldIds") as FormGroup;
    }
}
