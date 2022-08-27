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
