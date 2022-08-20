import { TestBed } from "@angular/core/testing";

import { LoggerService } from "../services/log-service";
import { UnitConversionService } from "../services/unit-conversion.service";

import { UnitConversionPipe } from "./unit-conversion.pipe";

describe("pipes >", () => {
    describe("unit conversion pipe >", () => {
        let pipe: UnitConversionPipe;

        beforeEach(() => {
            TestBed.configureTestingModule({
                providers: [LoggerService, UnitConversionService],
            });

            pipe = new UnitConversionPipe(
                TestBed.inject(UnitConversionService)
            );
        });

        it(`should use UnitBase.Bytes for the 'bytes' unit`, () => {
            expect(pipe.transform(1024, 2, false, "bytes")).toEqual("1 KB");
        });

        it(`should use UnitBase.Standard for units other than 'bytes'`, () => {
            expect(pipe.transform(1024, 2, false, "generic")).toEqual("1.02K");
        });
    });
});
