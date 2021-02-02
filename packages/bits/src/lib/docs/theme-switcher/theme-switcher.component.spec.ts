import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { SwitchComponent } from "../../switch/switch.component";

import { ThemeSwitcherComponent } from "./theme-switcher.component";

describe("ThemeSwitcherComponent", () => {
  let component: ThemeSwitcherComponent;
  let fixture: ComponentFixture<ThemeSwitcherComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SwitchComponent,
        ThemeSwitcherComponent,
      ],
      imports: [
        RouterTestingModule,
      ],
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThemeSwitcherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

    // afterEach(() => {
    //     fixture.destroy();
    // });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should be default mode like in operation system", () => {
    const isDarkModeEnabled = window.matchMedia("(prefers-color-scheme: dark)").matches;
    console.log(isDarkModeEnabled, (<Array<string>>[].slice.apply(document.children[0].classList)));
    expect((<Array<string>>[].slice.apply(document.children[0].classList)).includes("dark-nova-theme")).toBe(isDarkModeEnabled);
  });


  it("should be dark mode when method onThemeChange is called with true parameter", () => {
    component.onThemeChange(true);
    fixture.detectChanges();
    expect((<Array<string>>[].slice.apply(document.children[0].classList)).includes("dark-nova-theme")).toBeTruthy();
  });

  it("should be light mode when method onThemeChange is called with false parameter", () => {
    component.onThemeChange(false);
    fixture.detectChanges();
    expect((<Array<string>>[].slice.apply(document.children[0].classList)).includes("dark-nova-theme")).toBeFalsy();
  });
});
