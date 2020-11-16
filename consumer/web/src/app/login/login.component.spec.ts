import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { LogLevel, NuiModule } from "@solarwinds/nova-bits";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";

import { FormsModule } from "@angular/forms";

import { AuthService } from "../services/auth.service";

import { LoginComponent } from "./login.component";

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let authService: AuthService;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule,
                RouterTestingModule.withRoutes([]),
                NuiModule,
            ],
            declarations: [
                LoginComponent,
            ],
            providers: [
                AuthService,
                Apollo,
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        authService = TestBed.get(AuthService);
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("calls the authService to login", async () => {
        const login = spyOn(authService, "login").and.returnValue(of({
            username: "joe",
            roles: ["ADMIN"],
        }));

        component.username = "joe";
        component.password = "x";

        await component.login();

        expect(login).toHaveBeenCalledWith({
            username: "joe",
            password: "x",
        });
    });
});
