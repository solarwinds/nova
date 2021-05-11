import { LoggerService, UnitBase, UnitConversionService } from "@nova-ui/bits";
import { DEFAULT_UNIT_CONVERSION_THRESHOLD } from "../constants";

import { DashboardUnitConversionPipe } from "./dashboard-unit-conversion-pipe";

describe("DashboardUnitConversionPipe >", () => {
    let pipe: DashboardUnitConversionPipe;
    const unitConversionService = new UnitConversionService(new LoggerService());

    beforeEach(() => {
        pipe = new DashboardUnitConversionPipe(unitConversionService);
    });

    it(`should not abbreviate the value if it's less than DEFAULT_UNIT_CONVERSION_THRESHOLD`, () => {
        expect(pipe.transform(DEFAULT_UNIT_CONVERSION_THRESHOLD - 1)).toEqual((DEFAULT_UNIT_CONVERSION_THRESHOLD - 1).toLocaleString());
    });

    it(`should abbreviate the value if it's greater than or equal to DEFAULT_UNIT_CONVERSION_THRESHOLD`, () => {
        const conversion = unitConversionService.convert(DEFAULT_UNIT_CONVERSION_THRESHOLD, UnitBase.Standard, 1, true);
        const expectedDisplayValue = unitConversionService.getFullDisplay(conversion, "generic");

        expect(pipe.transform(DEFAULT_UNIT_CONVERSION_THRESHOLD)).toEqual(expectedDisplayValue);
    });
});
