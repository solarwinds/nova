import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { NuiModule } from "@solarwinds/nova-bits";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";

import { AppComponent } from "./app.component";
import { DemoWizardComponent } from "./demo-wizard/demo-wizard.component";
import { AuthService } from "./services/auth.service";

describe("AppComponent", () => {
    let component: AppComponent;
    let fixture: ComponentFixture<AppComponent>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                AppComponent,
                DemoWizardComponent,
            ],
            providers: [
                AuthService,
                Apollo,
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
            imports: [
                RouterTestingModule,
                NuiModule,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        component = fixture.componentInstance;

        authService = TestBed.get(AuthService);
    }));
    it("should create the app", async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it(`should have as title 'Rubber Duck'`, async(() => {
        const app = fixture.debugElement.componentInstance;
        expect(app.title).toEqual("Rubber Duck");
    }));
    it("should render title in a .rd-app__page-header .nui-text-page", async(() => {
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement;
        expect(compiled.querySelector(".rd-app__page-header .nui-text-page").textContent).toContain("Rubber Duck");
    }));

    it("should logout using the authService on logout", async () => {
        const logout = spyOn(authService, "logout").and.returnValue(of({}));

        await component.logout();

        expect(logout).toHaveBeenCalledTimes(1);
    });
});
