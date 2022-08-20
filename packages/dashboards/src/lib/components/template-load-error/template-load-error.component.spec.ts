import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../dashboards.module";

import { TemplateLoadErrorComponent } from "./template-load-error.component";

describe("TemplateLoadErrorComponent", () => {
    let component: TemplateLoadErrorComponent;
    let fixture: ComponentFixture<TemplateLoadErrorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TemplateLoadErrorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
