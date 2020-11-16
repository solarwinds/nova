import { SimpleChange } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { NuiDashboardsModule } from "../../dashboards.module";
import { EmbeddedContentMode } from "../types";

import { EmbeddedContentComponent } from "./embedded-content.component";

describe("EmbeddedContentComponent", () => {
    let component: EmbeddedContentComponent;
    let fixture: ComponentFixture<EmbeddedContentComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [ NuiDashboardsModule ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(EmbeddedContentComponent);
        component = fixture.componentInstance;
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should create iframe and apply embedded sanitized content there, when mode is `url`", () => {
            component.sanitized = true;
            component.mode = EmbeddedContentMode.URL;
            component.customEmbeddedContent = "https://www.ventusky.com/<script type='text/javascript'>alert(\'hello world!\');</script>";
            component.ngOnInit();

            const iframeElement = fixture.debugElement.nativeElement.querySelector("iframe");
            expect(iframeElement).toBeDefined();
            expect(iframeElement.src).not.toContain("</script>");
            expect(iframeElement.width).toEqual("100%");
            expect(iframeElement.height).toEqual("100%");
        });

        it("should create element with innerHTML and apply embedded sanitized content there, when mode is `html`", () => {
            component.sanitized = true;
            component.mode = EmbeddedContentMode.HTML;
            component.customEmbeddedContent = "<p><a href='../../example/index.html''>Link</a></p><script type='text/javascrip'>alert(\'hello world!\');</script>";
            spyOn(console, "warn"); // suppress sanitization warning
            component.ngOnInit();

            const anchorElement = component.anchor.nativeElement;
            expect(anchorElement).toBeDefined();
            expect(anchorElement.innerHTML).toEqual("<p><a href=\"../../example/index.html\">Link</a></p>");
        });
    });

    describe("ngOnChanges > ", () => {
        it("should change embedded content properly", () => {
            const oldEmbeddedContent = "https://www.ventusky.com/?p=50.3;31.2;5&l=radar";
            component.customEmbeddedContent = "https://www.ventusky.com/";
            const changes = {
                customEmbeddedContent: new SimpleChange(oldEmbeddedContent, component.customEmbeddedContent, false),
            };
            component.sanitized = true;
            component.mode = EmbeddedContentMode.URL;
            component.ngOnChanges(changes);

            const iframeElement = fixture.debugElement.nativeElement.querySelector("iframe");
            expect(iframeElement).toBeDefined();
            expect(iframeElement.src).toEqual(component.customEmbeddedContent);
        });
    });
});
