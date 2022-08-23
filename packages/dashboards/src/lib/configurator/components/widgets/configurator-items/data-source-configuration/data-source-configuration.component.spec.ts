import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";
import { DataSourceConfigurationComponent } from "./data-source-configuration.component";

describe("DataSourceConfigurationComponent", () => {
    let component: DataSourceConfigurationComponent;
    let fixture: ComponentFixture<DataSourceConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(DataSourceConfigurationComponent);
        component = fixture.componentInstance;
        component.providerId = "TestCaseOne";
        component.dataSourceProviders = ["TestCaseOne", "TestCaseTwo"];
        component.ngOnInit();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should setup the form when providerId is given", () => {
        fixture.detectChanges();
        expect(component.form.get("providerId")?.value).toEqual(
            component.dataSourceProviders[0]
        );
    });
});
