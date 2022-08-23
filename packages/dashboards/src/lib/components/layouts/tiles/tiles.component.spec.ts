import { ComponentFixture, TestBed, waitForAsync } from "@angular/core/testing";

import { EventBus } from "@nova-ui/bits";

import { NuiDashboardsModule } from "../../../dashboards.module";
import { DynamicComponentCreator } from "../../../pizzagna/services/dynamic-component-creator.service";
import { PizzagnaService } from "../../../pizzagna/services/pizzagna.service";
import { PIZZAGNA_EVENT_BUS } from "../../../types";
import { TilesComponent } from "./tiles.component";

describe("TilesComponent", () => {
    let component: TilesComponent;
    let fixture: ComponentFixture<TilesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            imports: [NuiDashboardsModule],
            providers: [
                PizzagnaService,
                DynamicComponentCreator,
                {
                    provide: PIZZAGNA_EVENT_BUS,
                    useClass: EventBus,
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(TilesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
});
