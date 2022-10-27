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
import { FormBuilder } from "@angular/forms";

import { LoggerService } from "@nova-ui/bits";

import { PizzagnaService } from "../../../../pizzagna/public-api";
import { DonutChartFormatterConfiguratorComponent } from "../widget-formatter-configurators/donut-formatter-configurator.component";

@Component({
    selector: "nui-donut-content-configurator",
    templateUrl: "donut-content-percentage-configuration.component.html",
})
export class DonutContentPercentageConfigurationComponent extends DonutChartFormatterConfiguratorComponent {
    static lateLoadKey = "DonutContentPercentageConfigurationComponent";

    constructor(
        changeDetector: ChangeDetectorRef,
        formBuilder: FormBuilder,
        logger: LoggerService,
        private pizzagnaService: PizzagnaService
    ) {
        super(changeDetector, formBuilder, logger);
    }
}
