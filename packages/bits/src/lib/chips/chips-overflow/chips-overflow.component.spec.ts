import { NO_ERRORS_SCHEMA } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ChipsOverflowComponent } from "./chips-overflow.component";

describe("components >", () => {
    describe("ChipsOverflowComponent", () => {
        let component: ChipsOverflowComponent;
        let fixture: ComponentFixture<ChipsOverflowComponent>;

        beforeEach(async(() => {
            TestBed.configureTestingModule({
                declarations: [ ChipsOverflowComponent ],
                imports: [],
                schemas: [ NO_ERRORS_SCHEMA ],
            })
            .compileComponents();
        }));

        beforeEach(() => {
            fixture = TestBed.createComponent(ChipsOverflowComponent);
            component = fixture.componentInstance;
            component.itemsSource = {};
            fixture.detectChanges();
        });

        it("should create component", () => {
            expect(component).toBeTruthy();
        });

        it("should emit data on clear", () => {
            const chipRemovedEmitSpy = spyOn(component.chipRemoved, "emit");
            
            const items = [
                {id: "statusGroupItem1", label: "Down"},
                {id: "statusGroupItem2", label: "Critical"},
                {id: "statusGroupItem3", label: "Warning"},
                {id: "statusGroupItem4", label: "Unknown"},
                {id: "statusGroupItem5", label: "Ok"},
            ];

            component.itemsSource.groupedItems = [{
                id: "statusGroupId",
                items: items,
                label: "Status",
            }];
            
            const data = {
                item: {
                    id: "statusGroupItem1",
                    label: "Down",
                },
                group: {
                    id: "statusGroupId", label: "Status", items: items,
                },
            };

            component.onClear(data);
            expect(chipRemovedEmitSpy).toHaveBeenCalledWith(data);
        });
    });
});
