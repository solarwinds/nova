import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../../dashboards.module";
import { NuiPizzagnaModule } from "../../../../pizzagna/pizzagna.module";
import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { SiUnitsFormatterComponent } from "./si-units-formatter.component";

const TEST_DATA: any[] = [
    {
        input: {
            value: 0,
        },
        expected: {
            value: "0",
            modifier: undefined,
        },
    },
    {
        input: {
            value: 1,
        },
        expected: {
            value: "1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: -1,
        },
        expected: {
            value: "-1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: -1,
        },
        expected: {
            value: "-1",
            modifier: undefined,
        },
    },
    {
        input: {
            value: 11234,
        },
        expected: {
            value: "11.2",
            modifier: "k",
        },
    },
    {
        input: {
            value: 2000000,
        },
        expected: {
            value: "2",
            modifier: "M",
        },
    },
    {
        input: {
            value: 5000000002,
        },
        expected: {
            value: "5",
            modifier: "G",
        },
    },
    {
        input: {
            value: -3472364782,
        },
        expected: {
            value: "-3.5",
            modifier: "G",
        },
    },
    {
        input: {
            value: "-445646546546540.25",
        },
        expected: {
            value: "-445.6",
            modifier: "T",
        },
    },
    {
        input: {
            value: "-445646546546540.25",
        },
        expected: {
            value: "-445.6",
            modifier: "T",
        },
    },
    {
        input: {
            value: "0.0000564564654654",
        },
        expected: {
            value: "56.5",
            modifier: "µ",
        },
    },
    {
        input: {
            value: "0.000000000564564654654",
        },
        expected: {
            value: "0.6",
            modifier: "n",
        },
    },
];

describe("SiUnitsFormatterComponent", () => {
    let component: SiUnitsFormatterComponent;
    let fixture: ComponentFixture<SiUnitsFormatterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiPizzagnaModule, NuiDashboardsModule],
            declarations: [SiUnitsFormatterComponent],
            providers: [PizzagnaService],
        });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SiUnitsFormatterComponent);
        component = fixture.componentInstance;

        fixture.detectChanges();
    });

    describe("value formatting > ", () => {
        TEST_DATA.forEach((test) => {
            it("should correctly format Si units", () => {
                const data = new SimpleChange(undefined, test.input, false);

                component.ngOnChanges({ data });
                expect(component.value).toEqual(test.expected.value);
                expect(component.modifier).toEqual(test.expected.modifier);
            });
        });
    });
});
