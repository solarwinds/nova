import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { NuiModule } from "@solarwinds/nova-bits";

import { UserRolesComponent } from "./user-roles.component";

describe("UserRolesComponent", () => {
  let component: UserRolesComponent;
  let fixture: ComponentFixture<UserRolesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            NuiModule,
        ],
        declarations: [ UserRolesComponent ],
        providers: [
            { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
        ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
