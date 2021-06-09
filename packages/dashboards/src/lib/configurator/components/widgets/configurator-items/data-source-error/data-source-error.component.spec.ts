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

describe("DataSourceErrorComponent", () => {
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

        component.dataSource = dataSource;
        const dataSourceChanged = {dataSource: new SimpleChange(null, dataSource, true)};
        component.ngOnChanges(dataSourceChanged);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should call changeDetector if there's an output on the dataSource", () => {
        const markForCheckSpy = spyOn(component.changeDetector, "markForCheck");

        component.dataSource.outputsSubject.next(null);

        expect(markForCheckSpy).toHaveBeenCalled();
    });

    it("should emit an errorState positive if there's an error on the output of a dataSource", () => {
       const errorState = spyOn(component.errorState, "emit");

        component.dataSource.outputsSubject.next({
            error: {
                type: 404,
                message: "Not Found",
            }
        });

        expect(errorState).toHaveBeenCalledWith(true);

        component.dataSource.outputsSubject.next({
            result: {
                hello: "world"
            }
        });

        expect(errorState).toHaveBeenCalledWith(true);
    });

    it("should set data to the same value if there is a result key for legacy dataSources", () => {
        component.dataSource.outputsSubject.next({
            result: {
                hello: "world"
            }
        });
        const testCaseA = component.data;

        component.dataSource.outputsSubject.next({
            hello: "world"
        });
        const testCaseB = component.data;

        expect(testCaseA).toEqual(testCaseB);
    });
});
