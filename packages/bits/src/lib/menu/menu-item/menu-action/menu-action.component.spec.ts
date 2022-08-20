import { MockedChangeDetectorRef } from "../../../../spec-helpers/angular";
import { MenuGroupComponent } from "../menu-group/menu-group.component";

import { MenuActionComponent } from "./menu-action.component";

describe("components >", () => {
    describe("menu-action >", () => {
        describe("handleClick function >", () => {
            let mockEvent: MouseEvent;
            let menuAction: MenuActionComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", [
                    "preventDefault",
                    "stopPropagation",
                ]);
                menuAction = new MenuActionComponent(
                    new MenuGroupComponent(),
                    new MockedChangeDetectorRef()
                );
            });

            it(`should prevent default behavior and stop propagation of click event if disabled`, () => {
                menuAction.disabled = true;
                menuAction.handleClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
            });

            it(`should prevent default behavior and should not stop propagation of click event if disabled`, () => {
                menuAction.disabled = false;
                menuAction.handleClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            });
        });
    });
});
