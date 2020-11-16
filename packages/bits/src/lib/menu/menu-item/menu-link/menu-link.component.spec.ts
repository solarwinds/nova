import { MockedChangeDetectorRef } from "../../../../spec-helpers/angular";
import { MenuGroupComponent } from "../menu-group/menu-group.component";

import { MenuLinkComponent } from "./menu-link.component";

describe("components >", () => {

    describe("menu-link >", () => {

        describe("handleClick function >", () => {

            let mockEvent: MouseEvent;
            let menuLink: MenuLinkComponent;

            beforeEach(() => {
                mockEvent = jasmine.createSpyObj("event", ["preventDefault", "stopPropagation"]);
                menuLink = new MenuLinkComponent(new MenuGroupComponent(), new MockedChangeDetectorRef());
            });

            it("should prevent default behavior and stop propagation of click event if disabled", () => {
                menuLink.disabled = true;
                menuLink.handleClick(mockEvent);

                expect(mockEvent.preventDefault).toHaveBeenCalled();
                expect(mockEvent.stopPropagation).toHaveBeenCalled();
            });

            it("should not prevent default behavior and stop propagation of click event if disabled", () => {
                menuLink.disabled = false;
                menuLink.handleClick(mockEvent);

                expect(mockEvent.preventDefault).not.toHaveBeenCalled();
                expect(mockEvent.stopPropagation).not.toHaveBeenCalled();
            });

        });

    });

});
