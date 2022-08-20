import { MenuGroupComponent } from "./menu-group.component";

describe("components >", () => {
    describe("menu-popup >", () => {
        describe("onHeaderClick function >", () => {
            let mockEvent: MouseEvent;
            let menuGroupComponent: MenuGroupComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", ["stopPropagation"]);
                menuGroupComponent = new MenuGroupComponent();
                menuGroupComponent.header = "Test header";
            });

            it(`should stop propagation on header and divider click`, () => {
                menuGroupComponent.stopClickPropagation(mockEvent);
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
            });
        });
    });
});
