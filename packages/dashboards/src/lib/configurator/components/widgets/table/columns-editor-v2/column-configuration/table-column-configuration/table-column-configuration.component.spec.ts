import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { TableColumnConfigurationComponent } from "./table-column-configuration.component";

describe("TableColumnConfigurationComponent", () => {
  let component: TableColumnConfigurationComponent;
  let fixture: ComponentFixture<TableColumnConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableColumnConfigurationComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableColumnConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
