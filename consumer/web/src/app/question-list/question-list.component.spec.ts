import { DatePipe } from "@angular/common";
import { TRANSLATIONS, TRANSLATIONS_FORMAT } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { DialogService, IFilteringOutputs, NuiModule } from "@solarwinds/nova-bits";

import { FromNowPipe } from "../pipes/from-now.pipe";
import { DataSourceFilterService } from "../services/data-source-filter.service";

import { QuestionListComponent } from "./question-list.component";
import { mockData } from "./question-list.mockData";

describe("QuestionListComponent", () => {
  let component: QuestionListComponent;
  let fixture: ComponentFixture<QuestionListComponent>;
  const dataSourceFilterService: DataSourceFilterService<any> = new DataSourceFilterService(null);
  const mockFilterState: IFilteringOutputs = {
    repeat: {
      itemsSource: mockData.testQuestions,
    },
    paginator: {
      total: mockData.testQuestions.length,
    },
  };

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      imports: [
        NuiModule,
        RouterTestingModule.withRoutes([]),
      ],
      declarations: [
        QuestionListComponent,
        FromNowPipe,
      ],
      providers: [
        DatePipe,
        DialogService,
        {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
        {provide: TRANSLATIONS, useValue: ""},
      ],
    })
      .overrideComponent(QuestionListComponent, {
        set: {
          providers: [
            { provide: DataSourceFilterService, useValue: dataSourceFilterService },
          ],
        },
      })
      .compileComponents();

    spyOn(dataSourceFilterService, "getFilteredData").and.returnValue(Promise.resolve(mockFilterState));

    fixture = TestBed.createComponent(QuestionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("initialization", () => {
    it("should create", () => {
      expect(component).toBeTruthy();
    });

    it("should initialize the list state", () => {
      expect(+component.filteringPaginator.pageSize).toEqual(10);
      expect(component.filteringPaginator.page).toEqual(1);
    });

  });
});
