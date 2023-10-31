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

import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { LoggerService } from "@nova-ui/bits";

import {
    IFormatterDefinition,
    ITableFormatterDefinition,
} from "../components/types";
import { RegistryService } from "./registry-service";
import { IAddFormattersOptions } from "./types";

export abstract class FormatterRegistryService<
    TFormatter extends IFormatterDefinition = IFormatterDefinition
> extends RegistryService<TFormatter> {
    /** @deprecated use 'stateChanged$' instead - NUI-5852 */
    public formattersStateChanged$: Observable<TFormatter[]> =
        this.stateChanged$;

    /** @deprecated use 'addItems' instead - NUI-5852 */
    public addFormatters(
        formatters: TFormatter[],
        options: IAddFormattersOptions = { overrideExisting: true }
    ): void {
        super.addItems(formatters, options);
    }

    /** @deprecated use 'getItems' instead - NUI-5852 */
    public getFormatters(): TFormatter[] {
        return super.getItems();
    }

    protected getItemKey(item: TFormatter): string {
        return item.componentType;
    }
}

@Injectable({ providedIn: "root" })
export class TableFormatterRegistryService extends FormatterRegistryService<ITableFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "TableFormatterRegistryService");
    }
}

@Injectable({ providedIn: "root" })
export class KpiFormattersRegistryService extends FormatterRegistryService<IFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "KpiFormattersRegistryService");
    }
}

@Injectable({ providedIn: "root" })
export class RiskScoreFormattersRegistryService extends FormatterRegistryService<IFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "RiskScoreFormattersRegistryService");
    }
}

@Injectable({ providedIn: "root" })
export class ProportionalDonutContentFormattersRegistryService extends FormatterRegistryService<IFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "ProportionalDonutContentFormattersRegistryService");
    }
}

@Injectable({ providedIn: "root" })
export class ProportionalLegendFormattersRegistryService extends FormatterRegistryService<IFormatterDefinition> {
    constructor(logger: LoggerService) {
        super(logger, "ProportionalLegendFormattersRegistryService");
    }
}
