import { Injectable } from "@angular/core";

import { LoggerService } from "./log-service";
import { IUnitConversionResult } from "./public-api";

/**
 * @ignore
 */
@Injectable({providedIn: "root"})
export class UnitConversionService {
    constructor(private logger: LoggerService) {}

    convert(value: number, base: number, precision: number = 1): IUnitConversionResult {
        let resultValue: number;
        let resultOrder: number;
        let strValue: string;

        if (value !== 0) {
            resultOrder = Math.floor(Math.log(Math.abs(value)) / Math.log(base));
            resultValue = value / Math.pow(base, Math.floor(resultOrder));

            if (value > 0 && value < 1) {
                this.logger.warn("unit conversion service does not support conversion to negative order of magnitude");
            }

            // fix the precision edge case
            const valueCeiled = Math.ceil(resultValue);
            if (valueCeiled % base === 0) {
                resultValue = valueCeiled / base;
                resultOrder += 1;
            }

            strValue = (resultValue).toFixed(precision);

            // remove trailing zeros
            strValue = strValue.replace(/\.0+$/, "");
        } else {
            resultOrder = 0;
            strValue = value.toString();
        }

        return {
            value: strValue,
            order: resultOrder,
        };
    }
}
