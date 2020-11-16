import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LogLevel, NuiModule } from "@solarwinds/nova-bits";

import { FromNowPipe } from "../pipes/from-now.pipe";

import { PostComponent } from "./post.component";

describe("PostComponent", () => {
  let component: PostComponent;
  let fixture: ComponentFixture<PostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        NuiModule,
      ],
      declarations: [
        PostComponent,
        FromNowPipe,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
