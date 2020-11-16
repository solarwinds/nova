import { SimpleChanges } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@solarwinds/nova-bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { TableColumnsConfigurationComponent } from "./table-columns-configuration.component";

describe("TableColumnsConfigurationComponent", () => {
    let component: TableColumnsConfigurationComponent;
    let fixture: ComponentFixture<TableColumnsConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TableColumnsConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnChanges > ", () => {
        it("should not throw if a column doesn't have a formatter defined", () => {
            component.columns = [{
                id: "testId",
                label: "",
                // @ts-ignore: Suppressed for test purposes
                formatter: null,
            }];

            const changes: SimpleChanges = {
                dataFields: {
                    previousValue: [{
                        id: "oldId",
                        label: "Old Label",
                        dataType: "string",
                    }],
                    currentValue: [{
                        id: "newId",
                        label: "New Label",
                        dataType: "string",
                    }],
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            spyOn(component, "onItemsChange");
            expect(() => component.ngOnChanges(changes)).not.toThrow();
        });
    });

});
