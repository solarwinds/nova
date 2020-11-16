import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { EventBus } from "@solarwinds/nova-bits";
import { XYGridConfig } from "@solarwinds/nova-charts";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { LineChartComponent } from "./line-chart.component";

describe("LineChartComponent", () => {
    let component: LineChartComponent;
    let fixture: ComponentFixture<LineChartComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: {},
                },
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LineChartComponent);
        component = fixture.componentInstance;
        (<any>component).buildChart();
        fixture.detectChanges();
    });

    it("should set the left axis to fit", () => {
        expect((component.chartAssist.chart.getGrid().config() as XYGridConfig).axis.left.fit).toEqual(true);
    });
});
