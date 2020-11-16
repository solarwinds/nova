import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { LogLevel, NuiModule } from "@solarwinds/nova-bits";

import { PostFormComponent } from "./post-form.component";

describe("PostFormComponent", () => {
  let component: PostFormComponent;
  let fixture: ComponentFixture<PostFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NuiModule,
        ReactiveFormsModule,
        FormsModule,
      ],
      declarations: [
        PostFormComponent,
      ],
      providers: [
        { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
