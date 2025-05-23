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
import { ComponentFixture, TestBed } from "@angular/core/testing";
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
                imports: [NuiOverlayModule],
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
                    IconComponent,
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
    });
});
