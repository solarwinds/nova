import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";

import { TitleAndDescriptionConfigurationComponent } from "./title-and-description-configuration.component";

describe("DataSourceConfigurationComponent", () => {
    let component: TitleAndDescriptionConfigurationComponent;
    let fixture: ComponentFixture<TitleAndDescriptionConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    useValue: () => {
                    },
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TitleAndDescriptionConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
