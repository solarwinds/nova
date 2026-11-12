// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import {
    Component,
    CUSTOM_ELEMENTS_SCHEMA,
    DebugElement,
    ViewChild,
} from "@angular/core";
import {
    ComponentFixture,
    fakeAsync,
    TestBed,
    tick,
} from "@angular/core/testing";
import { By } from "@angular/platform-browser";

import { MenuComponent } from "./menu.component";
import {
    DomUtilService,
    EdgeDetectionService,
    IconService,
    NuiOverlayModule,
    PopupComponent,
    PopupToggleDirective,
} from "../../../public_api";
import { LoggerService } from "../../../services/log-service";
import { ButtonComponent } from "../../button/button.component";
import { CheckboxComponent } from "../../checkbox/checkbox.component";
import { DividerComponent } from "../../divider/divider.component";
import { IconComponent } from "../../icon/icon.component";
import { SwitchComponent } from "../../switch/switch.component";
import { MenuActionComponent } from "../menu-item/menu-action/menu-action.component";
import { MenuGroupComponent } from "../menu-item/menu-group/menu-group.component";
import { MenuItemComponent } from "../menu-item/menu-item/menu-item.component";
import { MenuLinkComponent } from "../menu-item/menu-link/menu-link.component";
import { MenuOptionComponent } from "../menu-item/menu-option/menu-option.component";
import { MenuSwitchComponent } from "../menu-item/menu-switch/menu-switch.component";
import { MenuPopupComponent } from "../menu-popup/menu-popup.component";
import { IMenuGroup } from "../public-api";

@Component({
    selector: "nui-test-app",
    template: `
        <html>
            <body>
                <nui-menu
                    [title]="title"
                    [size]="size"
                    [icon]="icon"
                    [itemsSource]="itemsSource"
                >
                </nui-menu>
            </body>
        </html>
    `,
    standalone: false,
})
class TestAppComponent {
    @ViewChild(MenuComponent) menu: MenuComponent;
    public size = "small";
    public icon = "add";
    public title = "menu filled by json data";
    public itemsSource = [
        {
            header: "Header",
            itemsSource: [
                {
                    itemType: "link",
                    title: "Disabled link",
                    disabled: true,
                },
                {
                    itemType: "action",
                    title: "Action",
                    disabled: false,
                },
                {
                    itemType: "option",
                    title: "Option",
                    checked: false,
                },
            ],
        },
    ] as IMenuGroup[];
}

describe("components >", () => {
    let fixture: ComponentFixture<TestAppComponent>;
    let testComponent: TestAppComponent;
    let de: DebugElement;
    let el: HTMLElement;

    describe("menu >", () => {
        beforeEach(() => {
            TestBed.configureTestingModule({
                imports: [NuiOverlayModule, IconComponent],
                declarations: [
                    TestAppComponent,
                    MenuComponent,
                    MenuActionComponent,
                    MenuLinkComponent,
                    MenuOptionComponent,
                    MenuPopupComponent,
                    MenuSwitchComponent,
                    MenuGroupComponent,
                    MenuItemComponent,
                    ButtonComponent,
                    PopupComponent,
                    PopupToggleDirective,
                    CheckboxComponent,
                    DividerComponent,
                    SwitchComponent,
                    ButtonComponent,
                ],
                providers: [
                    IconService,
                    EdgeDetectionService,
                    DomUtilService,
                    LoggerService,
                ],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            });
            fixture = TestBed.createComponent(TestAppComponent);
            fixture.detectChanges();
            testComponent = fixture.componentInstance;
            de = fixture.debugElement.query(By.css("nui-menu"));
            el = de.nativeElement;
        });

        it("should contain menu-link in menu filled by json data", () => {
            testComponent.menu.popup.toggleOpened(new FocusEvent("focusin"));
            fixture.detectChanges();
            const linkMenu = el.querySelectorAll("nui-menu-link");
            expect(linkMenu.length).toBe(1);
        });

        it("should contain menu-header in menu filled by json data", () => {
            testComponent.menu.popup.toggleOpened(new FocusEvent("focusin"));
            fixture.detectChanges();
            const headerMenu = el.querySelectorAll(".nui-menu-item--header");
            expect(headerMenu.length).toBe(1);
        });

        it("should contain menu-action in menu filled by json data", () => {
            testComponent.menu.popup.toggleOpened(new FocusEvent("focusin"));
            fixture.detectChanges();
            const actionMenu = el.querySelectorAll("nui-menu-action");
            expect(actionMenu.length).toBe(1);
        });

        describe("accessibility >", () => {
            it("should have correct aria attributes on toggle button", () => {
                const button = fixture.debugElement.query(
                    By.css(".menu-button")
                );
                expect(button.attributes["aria-haspopup"]).toBe("menu");
                expect(button.attributes["aria-expanded"]).toBe("false");
                expect(button.attributes["aria-controls"]).toBeFalsy();

                // Open menu
                testComponent.menu.popup.toggleOpened(
                    new FocusEvent("focusin")
                );
                fixture.detectChanges();

                expect(button.attributes["aria-expanded"]).toBe("true");
                expect(button.attributes["aria-controls"]).toBeTruthy();
                const menuContentId = button.attributes["aria-controls"];
                const content = fixture.debugElement.query(
                    By.css("#" + menuContentId)
                );
                expect(content).toBeTruthy();
            });

            it("should not reset keyboard selection after opening with the mouse", fakeAsync(() => {
                const button = testComponent.menu.menuToggle
                    .nativeElement as HTMLButtonElement;

                button.focus();
                button.click();
                fixture.detectChanges();
                button.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "ArrowDown",
                        key: "ArrowDown",
                        keyCode: 40,
                        bubbles: true,
                        cancelable: true,
                    })
                );
                expect(testComponent.menu.popup.isOpen).toBeTrue();
                const activeDescendant = testComponent.menu.activeDescendant;
                expect(activeDescendant).toBeTruthy();
                tick();
                fixture.detectChanges();

                const menuContent =
                    testComponent.menu.menuContent.nativeElement;
                const action = menuContent.querySelector<HTMLElement>(
                    "nui-menu-action [role=menuitem]"
                );
                expect(action).toBeTruthy();
                expect(testComponent.menu.activeDescendant).toBe(
                    activeDescendant
                );
                expect(activeDescendant).toBe(action!.id);
            }));

            it("should focus the popup menu and keep its active descendant there", fakeAsync(() => {
                const button = fixture.debugElement.query(
                    By.css(".menu-button")
                ).nativeElement as HTMLButtonElement;

                button.focus();
                button.dispatchEvent(
                    new KeyboardEvent("keydown", {
                        code: "ArrowDown",
                        key: "ArrowDown",
                        bubbles: true,
                        cancelable: true,
                    })
                );
                // Opening must make the projected popup focusable before the
                // synchronous opened handler transfers keyboard focus.
                expect(document.activeElement).toBe(
                    testComponent.menu.menuContent.nativeElement
                );
                tick();
                fixture.detectChanges();

                const menuContentId = button.getAttribute("aria-controls");
                expect(menuContentId).toBeTruthy();
                const menuContent = document.getElementById(menuContentId!);
                expect(menuContent).toBeTruthy();
                expect(document.activeElement).toBe(menuContent);
                expect(button.getAttribute("role")).toBeNull();
                expect(button.getAttribute("aria-haspopup")).toBe("menu");
                expect(
                    button.hasAttribute("aria-activedescendant")
                ).toBeFalse();
                expect(menuContent!.getAttribute("aria-labelledby")).toBe(
                    button.id
                );
                expect(
                    menuContent!
                        .querySelector("nui-menu-popup")
                        ?.getAttribute("role")
                ).toBe("presentation");

                const activeItemId = menuContent!.getAttribute(
                    "aria-activedescendant"
                );
                expect(activeItemId).toBeTruthy();
                const activeItem = document.getElementById(activeItemId!);
                expect(activeItem).toBeTruthy();
                expect(menuContent!.contains(activeItem)).toBeTrue();
                expect(activeItem!.getAttribute("role")).toBe("menuitem");
            }));

            it("should have correct roles on menu-link", () => {
                // Ensure menu items are rendered
                testComponent.menu.popup.toggleOpened(
                    new FocusEvent("focusin")
                );
                fixture.detectChanges();

                const menuLinks = fixture.debugElement.queryAll(
                    By.directive(MenuLinkComponent)
                );
                expect(menuLinks.length).toBeGreaterThan(0);

                menuLinks.forEach(linkDebugEl => {
                    // Host element should have role="none"
                    expect(linkDebugEl.attributes["role"]).toBe("none");

                    // Anchor inside should have role="menuitem"
                    const anchor = linkDebugEl.query(By.css("a"));
                    expect(anchor.attributes["role"]).toBe("menuitem");
                });
            });
        });
    });
});
