import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DynamicComponentCreator } from "../../../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { KpiTilesConfigurationComponent } from "./kpi-tiles-configuration.component";

describe("KpiTilesConfigurationComponent", () => {
    let component: KpiTilesConfigurationComponent;
    let fixture: ComponentFixture<KpiTilesConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiTilesConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
