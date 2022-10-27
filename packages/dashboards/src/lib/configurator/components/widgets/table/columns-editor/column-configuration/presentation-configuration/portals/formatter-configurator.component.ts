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
    EventEmitter,
    Injectable,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { IDataField, LoggerService } from "@nova-ui/bits";

import {
    IFormatter,
    IFormatterConfigurator,
    IFormatterDefinition,
} from "../../../../../../../../components/types";
import { IHasChangeDetector, IHasForm } from "../../../../../../../../types";
import { ConfiguratorHeadingService } from "../../../../../../../services/configurator-heading.service";

@Injectable()
export abstract class FormatterConfiguratorComponent
    implements IFormatterConfigurator, IHasChangeDetector, IHasForm, OnChanges
{
    @Input() formatter: IFormatter;
    @Input() formatterDefinition: IFormatterDefinition;
    @Input() dataFields: IDataField[];
    @Input() formArrayName: string;

    @Output() formReady = new EventEmitter<FormGroup>();

    public form: FormGroup;
    public dropdownItems: Record<string, IDataField[]> = {};

    constructor(
        public changeDetector: ChangeDetectorRef,
        public configuratorHeading: ConfiguratorHeadingService,
        protected formBuilder: FormBuilder,
        public logger: LoggerService
    ) {}

    public ngOnChanges(changes: SimpleChanges) {
        if (changes.formatterDefinition) {
            this.mapDropdownItems();
            this.initForm();
        }
        if (changes.dataFields) {
            this.mapDropdownItems();
        }
        if (changes.formatter) {
            this.updateForm();
        }
    }

    /**
     * This method pregenerates lists of dropdown items for all required formatter columns mappings based on their type
     */
    public mapDropdownItems() {
        if (!this.dataFields) {
            this.logger.error(
                "There are no dataFields defined for formatter:",
                this.formatterDefinition
            );
            return;
        }

        this.dropdownItems = Object.keys(
            this.formatterDefinition.dataTypes
        ).reduce((result, next) => {
            const allowedDataTypes = this.formatterDefinition.dataTypes[next];

            result[next] = allowedDataTypes
                ? this.dataFields.filter((df) =>
                      // dataTypes could be a string or an array of strings, so we're checking that here
                      typeof allowedDataTypes === "string"
                          ? df.dataType === allowedDataTypes
                          : (allowedDataTypes as string[]).includes(df.dataType)
                  )
                : // if no data types are defined then just include all the fields
                  this.dataFields;

            return result;
        }, {} as Record<string, IDataField[]>);
    }

    get dataFieldIds(): FormGroup {
        return this.form.get("dataFieldIds") as FormGroup;
    }

    public initForm(): void {
        // initialize the formArray with selected values or null
        const dataFieldsDefinition = this.formatterDefinition.dataTypes || {};
        const dataFieldForm = Object.keys(dataFieldsDefinition).reduce(
            (result, next) => {
                result[next] = [
                    this.formatter?.properties?.dataFieldIds?.[next] ?? null,
                    Validators.required,
                ];
                return result;
            },
            {} as Record<string, any>
        );

        this.form = this.formBuilder.group({
            dataFieldIds: this.formBuilder.group(dataFieldForm),
        });

        this.addCustomFormControls(this.form);

        this.formReady.emit(this.form);
    }

    protected updateForm(): void {
        this.form.patchValue(this.formatter.properties ?? {}, {
            onlySelf: false,
            emitEvent: false,
        });
    }

    /**
     * Add your custom form controls here
     *
     * @param form
     */
    protected addCustomFormControls(form: FormGroup): void {}
}
