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

/// <reference path="./dialog-service.spec.d.ts" />

import { CommonModule } from "@angular/common";
import {
    Component,
    DebugElement,
    getDebugNode,
    Injectable,
    Injector,
    NgModule,
    OnDestroy,
    ViewChild,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import _noop from "lodash/noop";
import { Subject } from "rxjs/internal/Subject";

import { NuiActiveDialog, NuiDialogRef } from "./dialog-ref";
import { DialogStackService } from "./dialog-stack.service";
import { NuiDialogModule } from "./dialog.module";
import { DialogService } from "./dialog.service";

@Injectable()
class SpyService {
    called = false;
}

@Injectable()
class CustomSpyService {
    called = false;
}

@Component({ selector: "nui-custom-injector-cmpt", template: "Some content" })
export class CustomInjectorComponent implements OnDestroy {
    constructor(private _spyService: CustomSpyService) {}

    ngOnDestroy(): void {
        this._spyService.called = true;
    }
}

@Component({ selector: "nui-destroyable-cmpt", template: "Some content" })
export class DestroyableComponent implements OnDestroy {
    constructor(private _spyService: SpyService) {}

    ngOnDestroy(): void {
        this._spyService.called = true;
    }
}

@Component({
    selector: "nui-dialog-content-cmpt",
    template:
        "<button class='closeFromInside' (click)='close()'>Close</button>",
})
export class WithActiveDialogComponent {
    constructor(public activeDialog: NuiActiveDialog) {}

    close() {
        this.activeDialog.close("from inside");
    }
}

@Component({
    selector: "nui-test-cmpt",
    template: `
        <div id="testContainer"></div>
        <ng-template #content>Hello, {{ name }}!</ng-template>
        <ng-template #destroyableContent
            ><nui-destroyable-cmpt></nui-destroyable-cmpt
        ></ng-template>
        <ng-template #contentWithClose let-close="close">
            <button id="close" (click)="close('myResult')">Close me</button>
        </ng-template>
        <ng-template #contentWithDismiss let-dismiss="dismiss">
            <button id="dismiss" (click)="dismiss('myReason')">
                Dismiss me
            </button>
        </ng-template>
        <ng-template #contentWithIf>
            <ng-template [ngIf]="show">
                <button id="if" (click)="show = false">Click me</button>
            </ng-template>
        </ng-template>
        <button id="open" (click)="open('from button')">Open</button>
        <div id="open-no-focus" (click)="open('from non focusable element')">
            Open
        </div>
    `,
})
class TestComponent {
    name = "World";
    openedDialog: NuiDialogRef;
    show = true;
    @ViewChild("content", { static: true }) tplContent: any;
    @ViewChild("destroyableContent", { static: true })
    tplDestroyableContent: any;
    @ViewChild("contentWithClose", { static: true }) tplContentWithClose: any;
    @ViewChild("contentWithDismiss", { static: true })
    tplContentWithDismiss: any;
    @ViewChild("contentWithIf", { static: true }) tplContentWithIf: any;

    constructor(public dialogService: DialogService) {}

    open(content: string, options?: Object) {
        this.openedDialog = this.dialogService.open(content, options);
        return this.openedDialog;
    }
    close() {
        if (this.openedDialog) {
            this.openedDialog.close("ok");
        }
    }
    confirm() {
        this.openedDialog = this.dialogService.confirm({ message: "foo" });
        return this.openedDialog;
    }
    openTpl(options?: Object) {
        return this.dialogService.open(this.tplContent, options);
    }
    openCmpt(cmptType: any, options?: Object) {
        return this.dialogService.open(cmptType, options);
    }
    openDestroyableTpl(options?: Object) {
        return this.dialogService.open(this.tplDestroyableContent, options);
    }
    openTplClose(options?: Object) {
        return this.dialogService.open(this.tplContentWithClose, options);
    }
    openTplDismiss(options?: Object) {
        return this.dialogService.open(this.tplContentWithDismiss, options);
    }
    openTplIf(options?: Object) {
        return this.dialogService.open(this.tplContentWithIf, options);
    }
}

@NgModule({
    declarations: [
        TestComponent,
        CustomInjectorComponent,
        DestroyableComponent,
        WithActiveDialogComponent,
    ],
    exports: [TestComponent, DestroyableComponent],
    imports: [CommonModule, NuiDialogModule],
    entryComponents: [
        CustomInjectorComponent,
        DestroyableComponent,
        WithActiveDialogComponent,
    ],
    providers: [SpyService],
})
class DialogTestModule {}

describe("nui-dialog", () => {
    let fixture: ComponentFixture<TestComponent>;
    /**
     * In scope of NUI-3292 component (click) listener was substituted by (mousedown) and (mouseup). This is why we need this method
     * for certain cases below
     */
    const generateClickEvent = (el: HTMLElement) => {
        const mouseDownEvent = new MouseEvent("mousedown");
        const mouseUpEvent = new MouseEvent("mouseup");

        el.dispatchEvent(mouseDownEvent);
        el.dispatchEvent(mouseUpEvent);
    };

    beforeEach(() => {
        jasmine.addMatchers({
            toHaveDialog: () => ({
                compare: (actual: any, content?: any, selector?: any) => {
                    const allDialogsContent = document
                        .querySelector(selector || "body")
                        .querySelectorAll(".dialog-content");
                    let pass: boolean;
                    let errMsg;

                    if (!content) {
                        pass = allDialogsContent.length > 0;
                        errMsg = "at least one dialog open but found none";
                    } else if (Array.isArray(content)) {
                        pass = allDialogsContent.length === content.length;
                        errMsg = `${content.length} dialogs open but found ${allDialogsContent.length}`;
                    } else {
                        pass =
                            allDialogsContent.length === 1 &&
                            allDialogsContent[0].textContent.trim() === content;
                        errMsg = `exactly one dialog open but found ${allDialogsContent.length}`;
                    }

                    return {
                        pass: pass,
                        message: `Expected ${actual.outerHTML} to have ${errMsg}`,
                    };
                },
                negativeCompare: (actual: any) => {
                    const allOpenDialogs =
                        actual.querySelectorAll("nui-dialog-window");

                    return {
                        pass: allOpenDialogs.length === 0,
                        message: `Expected ${actual.outerHTML} not to have any dialogs open but found ${allOpenDialogs.length}`,
                    };
                },
            }),
        });

        jasmine.addMatchers({
            toHaveBackdrop: () => ({
                compare: (actual: any) => ({
                    pass:
                        document.querySelectorAll("nui-dialog-backdrop")
                            .length === 1,
                    message: `Expected ${actual.outerHTML} to have exactly one backdrop element`,
                }),
                negativeCompare: (actual: any) => {
                    const allOpenDialogs = document.querySelectorAll(
                        "nui-dialog-backdrop"
                    );

                    return {
                        pass: allOpenDialogs.length === 0,
                        message: `Expected ${actual.outerHTML} not to have any backdrop elements`,
                    };
                },
            }),
        });
    });

    beforeEach(() => {
        const mockRouter = {
            events: new Subject<any>(),
        };

        TestBed.configureTestingModule({
            imports: [DialogTestModule],
            providers: [
                DialogService,
                DialogStackService,
                { provide: Router, useValue: mockRouter },
            ],
        });
        fixture = TestBed.createComponent(TestComponent);
    });

    afterEach(() => {
        // detect left-over dialogs and close them or report errors when can"t
        const remainingDialogWindows =
            document.querySelectorAll("nui-dialog-window");
        if (remainingDialogWindows.length) {
            fail(
                `${remainingDialogWindows.length} dialog windows were left in the DOM.`
            );
        }

        const remainingDialogBackdrops = document.querySelectorAll(
            "nui-dialog-backdrop"
        );
        if (remainingDialogBackdrops.length) {
            fail(
                `${remainingDialogBackdrops.length} dialog backdrops were left in the DOM.`
            );
        }
    });

    describe("basic functionality", () => {
        it("should open and close dialog with default options", () => {
            const dialogInstance = fixture.componentInstance.open("foo");
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");
            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should open and close dialog from a TemplateRef content", () => {
            const dialogInstance = fixture.componentInstance.openTpl();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Hello, World!");

            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should properly destroy TemplateRef content", () => {
            const spyService = fixture.debugElement.injector.get(SpyService);
            const dialogInstance =
                fixture.componentInstance.openDestroyableTpl();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Some content");
            expect(spyService.called).toBeFalsy();

            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
            expect(spyService.called).toBeTruthy();
        });

        it("should open and close dialog from a component type", () => {
            const spyService = fixture.debugElement.injector.get(SpyService);
            const dialogInstance =
                fixture.componentInstance.openCmpt(DestroyableComponent);
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Some content");
            expect(spyService.called).toBeFalsy();

            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
            expect(spyService.called).toBeTruthy();
        });

        it("should inject active dialog ref when component is used as content", () => {
            fixture.componentInstance.openCmpt(WithActiveDialogComponent);
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Close");

            (<HTMLElement>(
                document.querySelector("button.closeFromInside")
            )).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should expose component used as dialog content", () => {
            const dialogInstance = fixture.componentInstance.openCmpt(
                WithActiveDialogComponent
            );
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Close");
            expect(
                dialogInstance.componentInstance instanceof
                    WithActiveDialogComponent
            ).toBeTruthy();

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should open and close dialog from inside", () => {
            fixture.componentInstance.openTplClose();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#close")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should open and dismiss dialog from inside", () => {
            fixture.componentInstance.openTplDismiss().result.catch(_noop);
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#dismiss")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should resolve result promise on close", async () => {
            let resolvedResult: any;
            fixture.componentInstance
                .openTplClose()
                .result.then((result) => (resolvedResult = result));

            // const resolvedResult = await fixture.componentInstance.openTplClose().result;
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#close")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();

            await fixture.whenStable();
            expect(resolvedResult).toBe("myResult");
        });

        it("should reject result promise on dismiss", async () => {
            let rejectReason: any;
            fixture.componentInstance
                .openTplDismiss()
                .result.catch((reason) => (rejectReason = reason));
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#dismiss")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();

            await fixture.whenStable();
            expect(rejectReason).toBe("myReason");
        });

        it("should add / remove 'dialog-open' class to body when dialog is open", () => {
            const dialogRef = fixture.componentInstance.open("bar");
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();
            expect(document.body.classList).toContain("dialog-open");

            dialogRef.close("bar result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
            expect(document.body.classList).not.toContain("dialog-open");
        });

        it("should not throw when close called multiple times", () => {
            const dialogInstance = fixture.componentInstance.open("foo");
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");

            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();

            dialogInstance.close("some result");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should not throw when dismiss called multiple times", () => {
            const dialogRef = fixture.componentInstance.open("foo");
            dialogRef.result.catch(_noop);

            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");

            dialogRef.dismiss("some reason");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();

            dialogRef.dismiss("some reason");
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("backdrop options", () => {
        it("should have backdrop by default", () => {
            const dialogInstance = fixture.componentInstance.open("foo");
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(fixture.nativeElement).toHaveBackdrop();

            dialogInstance.close("some reason");
            fixture.detectChanges();

            expect(fixture.nativeElement).not.toHaveDialog();
            expect(fixture.nativeElement).not.toHaveBackdrop();
        });

        it("should open and close dialog without backdrop", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                backdrop: false,
            });
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(fixture.nativeElement).not.toHaveBackdrop();

            dialogInstance.close("some reason");
            fixture.detectChanges();

            expect(fixture.nativeElement).not.toHaveDialog();
            expect(fixture.nativeElement).not.toHaveBackdrop();
        });

        it("should open and close dialog without backdrop from template content", () => {
            const dialogInstance = fixture.componentInstance.openTpl({
                backdrop: false,
            });
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog("Hello, World!");
            expect(fixture.nativeElement).not.toHaveBackdrop();

            dialogInstance.close("some reason");
            fixture.detectChanges();

            expect(fixture.nativeElement).not.toHaveDialog();
            expect(fixture.nativeElement).not.toHaveBackdrop();
        });

        it("should dismiss on backdrop click", () => {
            fixture.componentInstance.open("foo").result.catch(_noop);
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(fixture.nativeElement).toHaveBackdrop();

            generateClickEvent(
                <HTMLElement>document.querySelector("nui-dialog-window")
            );
            fixture.detectChanges();

            expect(fixture.nativeElement).not.toHaveDialog();
            expect(fixture.nativeElement).not.toHaveBackdrop();
        });

        it("should not dismiss on 'static' backdrop click", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                backdrop: "static",
            });
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(fixture.nativeElement).toHaveBackdrop();

            generateClickEvent(
                <HTMLElement>document.querySelector("nui-dialog-window")
            );
            fixture.detectChanges();

            expect(fixture.nativeElement).toHaveDialog();
            expect(fixture.nativeElement).toHaveBackdrop();

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should not dismiss on clicks that result in detached elements", () => {
            const dialogInstance = fixture.componentInstance.openTplIf({});
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#if")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("beforeDismiss options", () => {
        it("should not dismiss when the callback returns false", () => {
            const dialogInstance = fixture.componentInstance.openTplDismiss({
                beforeDismiss: () => false,
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#dismiss")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should dimiss when the callback does not return false", () => {
            fixture.componentInstance.openTplDismiss({ beforeDismiss: _noop });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#dismiss")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should dismiss when the callback is not defined", () => {
            fixture.componentInstance.openTplDismiss({});
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            (<HTMLElement>document.querySelector("button#dismiss")).click();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("container options", () => {
        it("should attach window and backdrop elements to the specified container", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                container: "#testContainer",
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo", "#testContainer");

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should throw when the specified container element doesnt exist", () => {
            const brokenSelector = "#notInTheDOM";
            expect(() => {
                fixture.componentInstance.open("foo", {
                    container: brokenSelector,
                });
            }).toThrowError(
                new RegExp(`container(.*)${brokenSelector}(.*)not found`)
            );
        });
    });

    describe("keyboard options", () => {
        it("should dismiss dialogs on ESC by default", () => {
            fixture.componentInstance.open("foo").result.catch(_noop);
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");

            (<DebugElement>(
                getDebugNode(document.querySelector("nui-dialog-window"))
            )).triggerEventHandler("keyup.esc", {});
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });

        it("should not dismiss dialogs on ESC when default is prevented", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                keyboard: true,
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");

            (<DebugElement>(
                getDebugNode(document.querySelector("nui-dialog-window"))
            )).triggerEventHandler("keyup.esc", {
                defaultPrevented: true,
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog();

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("size options", () => {
        it("should render dialogs with specified size", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                size: "sm",
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(
                document.querySelector(".modal-dialog")?.classList
            ).toContain("dialog-sm");

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("window custom class options", () => {
        it("should render dialogs with the correct window custom classes", () => {
            const dialogInstance = fixture.componentInstance.open("foo", {
                windowClass: "bar",
            });
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(
                document.querySelector("nui-dialog-window")?.classList
            ).toContain("bar");

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("custom injector option", () => {
        it("should render dialog with a custom injector", () => {
            const customInjector = Injector.create({
                providers: [
                    {
                        provide: CustomSpyService,
                        useClass: CustomSpyService,
                        deps: [],
                    },
                ],
            });
            const dialogInstance = fixture.componentInstance.openCmpt(
                CustomInjectorComponent,
                { injector: customInjector }
            );
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("Some content");

            dialogInstance.close();
            fixture.detectChanges();
            expect(fixture.nativeElement).not.toHaveDialog();
        });
    });

    describe("focus management", () => {
        it("should focus dialog window and return focus to previously focused element", () => {
            fixture.detectChanges();
            const openButtonEl =
                fixture.nativeElement.querySelector("button#open");

            openButtonEl.focus();
            openButtonEl.click();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("from button");
            expect(document.activeElement).toBe(
                document.querySelector("nui-dialog-window")
            );

            fixture.componentInstance.close();
            expect(fixture.nativeElement).not.toHaveDialog();
            expect(document.activeElement).toBe(openButtonEl);
        });

        it("should return focus to body if no element focused prior to dialog opening", () => {
            const dialogInstance = fixture.componentInstance.open("foo");
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog("foo");
            expect(document.activeElement).toBe(
                document.querySelector("nui-dialog-window")
            );

            dialogInstance.close("ok!");
            expect(document.activeElement).toBe(document.body);
        });

        it("should return focus to body if the opening element is not stored as previously focused element", () => {
            fixture.detectChanges();
            const openElement =
                fixture.nativeElement.querySelector("#open-no-focus");

            openElement.click();
            fixture.detectChanges();
            expect(fixture.nativeElement).toHaveDialog(
                "from non focusable element"
            );
            expect(document.activeElement).toBe(
                document.querySelector("nui-dialog-window")
            );

            fixture.componentInstance.close();
            expect(fixture.nativeElement).not.toHaveDialog();
            expect(document.activeElement).toBe(document.body);
        });
    });

    describe("window element ordering", () => {
        it("should place newer windows on top of older ones", () => {
            const dialogInstance1 = fixture.componentInstance.open("foo", {
                windowClass: "window-1",
            });
            fixture.detectChanges();

            const dialogInstance2 = fixture.componentInstance.open("bar", {
                windowClass: "window-2",
            });
            fixture.detectChanges();

            const windows = document.querySelectorAll("nui-dialog-window");
            expect(windows.length).toBe(2);
            expect(windows[0].classList).toContain("window-1");
            expect(windows[1].classList).toContain("window-2");

            dialogInstance2.close();
            dialogInstance1.close();
            fixture.detectChanges();
        });
    });

    describe("afterOpened$", () => {
        it("should emit when dialogService.open is called", () => {
            const subjectSpy = spyOn(
                fixture.componentInstance.dialogService.afterOpened$,
                "next"
            );
            const dialogInstance = fixture.componentInstance.open("foo", {
                windowClass: "window-1",
            });
            fixture.detectChanges();

            expect(subjectSpy).toHaveBeenCalledTimes(1);

            dialogInstance.close();
            fixture.detectChanges();
        });

        it("should emit when dialogService.confirm is called", () => {
            const subjectSpy = spyOn(
                fixture.componentInstance.dialogService.afterOpened$,
                "next"
            );
            const dialogInstance = fixture.componentInstance.confirm();
            fixture.detectChanges();

            expect(subjectSpy).toHaveBeenCalledTimes(1);

            dialogInstance.close();
            fixture.detectChanges();
        });
    });
});
