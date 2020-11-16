import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";

import { KpiDescriptionConfigurationComponent } from "./kpi-description-configuration.component";

describe("DataSourceConfigurationComponent", () => {
    let component: KpiDescriptionConfigurationComponent;
    let fixture: ComponentFixture<KpiDescriptionConfigurationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiDescriptionConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
