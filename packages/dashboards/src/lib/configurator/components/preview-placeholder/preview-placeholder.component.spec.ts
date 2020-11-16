import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { PreviewPlaceholderComponent } from "./preview-placeholder.component";

describe("PreviewPlaceholderComponent", () => {
  let component: PreviewPlaceholderComponent;
  let fixture: ComponentFixture<PreviewPlaceholderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPlaceholderComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPlaceholderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
