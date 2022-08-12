import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";
import { LinkFormatterComponent } from "./link-formatter.component";

describe("LinkFormatterComponent", () => {
    let component: LinkFormatterComponent;
    let fixture: ComponentFixture<LinkFormatterComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [
                LinkFormatterComponent,
            ],
            imports: [],
            providers: [
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(LinkFormatterComponent);
        component = fixture.componentInstance;
    }));

    it("Defaults to open in new tab", () => {
        component.ngOnChanges({});
        expect(component.target).toBe("_blank");
    });

    it("Detects changes for target property", () => {
        component.targetSelf = true;
        component.ngOnChanges({});
        expect(component.target).toBe("_self");
    });
});
