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

import { ChangeDetectorRef, Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";

import { LoggerService } from "@nova-ui/bits";

import { IHasChangeDetector } from "../../../../../../../../../types";
import { ConfiguratorHeadingService } from "../../../../../../../../services/configurator-heading.service";
import { FormatterConfiguratorComponent } from "../formatter-configurator.component";

@Component({
    selector: "nui-link-configurator",
    templateUrl: "./link-configurator.component.html",
})
export class LinkConfiguratorComponent
    extends FormatterConfiguratorComponent
    implements IHasChangeDetector
{
    public static lateLoadKey = "LinkConfiguratorComponent";

    constructor(
        changeDetector: ChangeDetectorRef,
        configuratorHeading: ConfiguratorHeadingService,
        formBuilder: FormBuilder,
        logger: LoggerService
    ) {
        super(changeDetector, configuratorHeading, formBuilder, logger);
    }

    public initForm(): void {
        const dataFieldForm: Record<string, any> = {
            link: [null, Validators.required],
            value: [null, Validators.required],
        };

        this.form = this.formBuilder.group({
            dataFieldIds: this.formBuilder.group(dataFieldForm),
            targetSelf: [false],
        });

        this.formReady.emit(this.form);
    }
}
