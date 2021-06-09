import { DataSourceErrorComponent } from "./data-source-error.component";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { NuiDashboardsModule } from "../../../../../dashboards.module";
import { DataSourceFeatures, IDataSource, IFilteringOutputs, IFilteringParticipants, NuiMessageModule } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { DATA_SOURCE } from "../../../../../types";
import { SimpleChange } from "@angular/core";

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

fdescribe("DataSourceErrorComponent", () => {
    let component: DataSourceErrorComponent;
    let fixture: ComponentFixture<DataSourceErrorComponent>;
    let dataSource: IDataSource;

    beforeEach(() => {
        dataSource = new MockDataSource();

        TestBed.configureTestingModule({
            imports: [
                NuiDashboardsModule,
                NuiMessageModule
            ],
        });
       fixture = TestBed.createComponent(DataSourceErrorComponent);
       component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call changeDetector if there's an output on the dataSource", async () => {
        const markForCheckSpy = spyOn(component.changeDetector, "markForCheck");

        component.dataSource = dataSource;
        const dataSourceChanged = {dataSource: new SimpleChange(null, dataSource, true)};
        component.ngOnChanges(dataSourceChanged);

        await component.dataSource.applyFilters();

        component.dataSource.outputsSubject.subscribe(() => {
            expect(markForCheckSpy).toHaveBeenCalled();
        })
    });
});
