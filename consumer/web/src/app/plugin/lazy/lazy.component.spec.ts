import {TRANSLATIONS, TRANSLATIONS_FORMAT} from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { LogLevel, NuiModule } from "@solarwinds/nova-bits";

import { LazyComponent } from "./lazy.component";

describe("LazyComponent", () => {
    let component: LazyComponent;
    let fixture: ComponentFixture<LazyComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                NuiModule,
            ],
            declarations: [
                LazyComponent,
            ],
            providers: [
                {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
                {provide: TRANSLATIONS, useValue: ""},
            ],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LazyComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
