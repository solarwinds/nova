import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { DataSourceFeatures, EventBus, IDataSource, IEvent, IFilteringOutputs, IFilteringParticipants } from "@solarwinds/nova-bits";
import { Subject } from "rxjs";

import { NuiDashboardsModule } from "../../dashboards.module";
import { DynamicComponentCreator } from "../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { ProviderRegistryService } from "../../services/provider-registry.service";
import { DATA_SOURCE, PIZZAGNA_EVENT_BUS, WellKnownDataSourceFeatures } from "../../types";

import { KpiComponent } from "./kpi.component";

class MockDataSource implements IDataSource {
    public outputsSubject = new Subject<IFilteringOutputs>();
    public filterParticipants: IFilteringParticipants;
    public features = new DataSourceFeatures({});

    public async applyFilters(): Promise<void> {
        // @ts-ignore: Suppressed for testing purposes
        return null;
    }

    public registerComponent(components: Partial<IFilteringParticipants>): void {
        // @ts-ignore: Suppressed for testing purposes
        this.filterParticipants = components;
    }

    public deregisterComponent(componentKey: string) {
        delete this.filterParticipants?.[componentKey];
    }
}

describe("KpiComponent", () => {
    let component: KpiComponent;
    let fixture: ComponentFixture<KpiComponent>;
    const eventBus = new EventBus<IEvent>();
    const dynamicComponentCreator = new DynamicComponentCreator();
    const pizzagnaService = new PizzagnaService(eventBus, dynamicComponentCreator);
    let dataSource: IDataSource;

    beforeEach(async(() => {
        dataSource = new MockDataSource();

        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                ProviderRegistryService,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useValue: eventBus,
                },
                {
                    provide: DATA_SOURCE,
                    useValue: dataSource,
                },
                {
                    provide: PizzagnaService,
                    useValue: pizzagnaService,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KpiComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("interactive", () => {
        it("is interactive when datasource is interactive", () => {
            expect(component.interactive).toBeFalsy();

            dataSource.features = new DataSourceFeatures({ [WellKnownDataSourceFeatures.Interactivity]: { enabled: true } });

            expect(component.interactive).toBe(true);
        });

        it("is interactive when configured as interactive", () => {
            expect(component.interactive).toBeFalsy();

            component.configuration = { interactive: true };

            expect(component.interactive).toBe(true);
        });
    });

});
