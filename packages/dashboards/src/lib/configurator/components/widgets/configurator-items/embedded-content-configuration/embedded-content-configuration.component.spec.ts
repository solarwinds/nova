import { SimpleChange } from "@angular/core";
import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EmbeddedContentMode } from "../../../../../components/types";
import { NuiDashboardsModule } from "../../../../../dashboards.module";

import { EmbeddedContentConfigurationComponent } from "./embedded-content-configuration.component";

describe("EmbeddedContentConfigurationComponent > ", () => {
    let component: EmbeddedContentConfigurationComponent;
    let fixture: ComponentFixture<EmbeddedContentConfigurationComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmbeddedContentConfigurationComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should build a form", () => {
            component.ngOnInit();
            expect(component.form.get("customEmbeddedContent")?.value).toEqual("");
        });

        it("should emit formReady", () => {
            const spy = spyOn(component.formReady, "emit");
            component.ngOnInit();
            expect(spy).toHaveBeenCalledWith(component.form);
        });
    });

    describe("ngOnChanges > ", () => {
        it("should update value in form", () => {
            component.mode = EmbeddedContentMode.URL;
            component.ngOnInit();
            component.customEmbeddedContent = "https://www.ventusky.com/";
            const changes = {
                customEmbeddedContent: new SimpleChange("", component.customEmbeddedContent, false),
            };

            component.ngOnChanges(changes);
            expect(component.form.get("urlCustomContent")?.value).toEqual(component.customEmbeddedContent);
        });
    });

});
