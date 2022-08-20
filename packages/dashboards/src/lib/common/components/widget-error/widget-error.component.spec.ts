import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { NuiImageModule } from "@nova-ui/bits";

import { WidgetErrorComponent } from "./widget-error.component";

describe("WidgetErrorComponent", () => {
    let component: WidgetErrorComponent;
    let fixture: ComponentFixture<WidgetErrorComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [WidgetErrorComponent],
            imports: [NuiImageModule],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(WidgetErrorComponent);
        component = fixture.componentInstance;
        component.image = "no-data-to-show";
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
