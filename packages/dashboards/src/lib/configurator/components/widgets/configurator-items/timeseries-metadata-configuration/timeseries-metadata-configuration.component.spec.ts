import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { ProviderRegistryService } from "../../../../../services/provider-registry.service";
import { PIZZAGNA_EVENT_BUS } from "../../../../../types";

import { ITimeSpanOption, TimeseriesMetadataConfigurationComponent } from "./timeseries-metadata-configuration.component";

describe("TimeseriesMetadataConfigurationComponent", () => {
    let component: TimeseriesMetadataConfigurationComponent;
    let fixture: ComponentFixture<TimeseriesMetadataConfigurationComponent>;

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
        fixture = TestBed.createComponent(TimeseriesMetadataConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should set the default timeSpan if no value is set", () => {
        component.ngOnInit();

        const timeSpanControl = component.form.controls["startingTimespan"];
        let emittedValue: any = undefined;
        timeSpanControl.setValue(null);
        timeSpanControl.valueChanges.subscribe((value: any) => {
            emittedValue = value;
        });

        const timeSpans: ITimeSpanOption[] = [
            { id: "aaa", name: "AAA" },
            { id: "bbb", name: "BBB" }
        ];
        component.timeSpans = timeSpans;
        component.ngOnChanges({ timeSpans: new SimpleChange(null, timeSpans, true) });

        expect(timeSpanControl.value).toEqual(timeSpans[0]);
        expect(emittedValue).toEqual(timeSpans[0]);
    })
});
