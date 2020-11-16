import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { IFilteringOutputs, NuiModule } from "@solarwinds/nova-bits";

import { FromNowPipe } from "../pipes/from-now.pipe";
import { mockData } from "../question-list/question-list.mockData";
import { DataSourceFilterService } from "../services/data-source-filter.service";

import { SearchResultsComponent } from "./search-results.component";

describe("SearchResultsComponent", () => {
    let component: SearchResultsComponent;
    let fixture: ComponentFixture<SearchResultsComponent>;
    const dataSourceFilterService: DataSourceFilterService<any> = new DataSourceFilterService(null);

    const mockFilterState: IFilteringOutputs = {
        repeat: {
            itemsSource: mockData.testQuestions,
        },
        paginator: {
            total: mockData.testQuestions.length,
        },
    };

    beforeEach(async(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NuiModule,
                RouterTestingModule.withRoutes([]),
            ],
            declarations: [
                SearchResultsComponent,
                FromNowPipe,
            ],
            providers: [
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
        })
            .overrideComponent(SearchResultsComponent, {
                set: {
                    providers: [
                        { provide: DataSourceFilterService, useValue: dataSourceFilterService },
                    ],
                },
            })
            .compileComponents();
    }));

    beforeEach(() => {
        spyOn(dataSourceFilterService, "getFilteredData").and.returnValue(Promise.resolve(mockFilterState));

        fixture = TestBed.createComponent(SearchResultsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
