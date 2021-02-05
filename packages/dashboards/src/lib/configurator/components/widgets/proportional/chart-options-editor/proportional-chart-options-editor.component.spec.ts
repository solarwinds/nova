import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { ProportionalChartOptionsEditorComponent } from "./proportional-chart-options-editor.component";

describe("ProportionalChartOptionsEditorComponent", () => {
    let component: ProportionalChartOptionsEditorComponent;
    let fixture: ComponentFixture<ProportionalChartOptionsEditorComponent>;

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
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProportionalChartOptionsEditorComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
