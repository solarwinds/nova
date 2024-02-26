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

import { DOCUMENT } from "@angular/common";
import {
    ApplicationRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    Injectable,
    Injector,
    TemplateRef,
} from "@angular/core";
import isNil from "lodash/isNil";

import { DialogBackdropComponent } from "./dialog-backdrop.component";
import { NuiActiveDialog, NuiDialogRef } from "./dialog-ref";
import { DialogComponent } from "./dialog.component";
import { ContentRef } from "../../services/content-ref";
import { OverlayContainerService } from "../overlay/public-api";

/**
 * @dynamic
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class DialogStackService {
    private windowAttributes = ["backdrop", "keyboard", "size", "windowClass"];

    constructor(
        private applicationRef: ApplicationRef,
        private injector: Injector,
        private factoryResolver: ComponentFactoryResolver,
        private overlayContainerService: OverlayContainerService,
        @Inject(DOCUMENT) private document: Document
    ) {}

    open(
        moduleCFR: ComponentFactoryResolver,
        contentInjector: Injector,
        content: any,
        options: any
    ): NuiDialogRef {
        let containerEl: HTMLElement = options.container
            ? this.document.querySelector(options.container)
            : this.document.body;

        // This handles the case when the nui-dialog is being used within the nui-overlay based components
        if (options.useOverlay) {
            containerEl = options.container
                ? this.document.querySelector(options.container)
                : this.overlayContainerService.getOverlayContainer();
        }

        if (!containerEl) {
            throw new Error(
                `The specified dialog container '${
                    options.container || "body"
                }' was not found in the DOM.`
            );
        }

        const activeDialog = new NuiActiveDialog();
        const contentRef = this.getContentRef(
            moduleCFR,
            options.injector || contentInjector,
            content,
            activeDialog
        );

        const backdropCmptRef:
            | ComponentRef<DialogBackdropComponent>
            | undefined =
            options.backdrop !== false
                ? this.attachBackdrop(containerEl)
                : undefined;
        const windowCmptRef: ComponentRef<DialogComponent> =
            this.attachWindowComponent(
                containerEl,
                contentRef,
                DialogComponent
            );
        const nuiDialogRef: NuiDialogRef = new NuiDialogRef(
            windowCmptRef,
            contentRef,
            backdropCmptRef,
            options.beforeDismiss
        );

        activeDialog.close = (result: any) => {
            nuiDialogRef.close(result);
        };
        activeDialog.dismiss = (reason: any) => {
            nuiDialogRef.dismiss(reason);
        };

        this.applyWindowOptions(windowCmptRef.instance, options);
        return nuiDialogRef;
    }

    private attachBackdrop(
        containerEl: any
    ): ComponentRef<DialogBackdropComponent> {
        const backdropFactory: ComponentFactory<DialogBackdropComponent> =
            this.factoryResolver.resolveComponentFactory(
                DialogBackdropComponent
            );
        const backdropCmptRef = backdropFactory.create(this.injector);
        this.applicationRef.attachView(backdropCmptRef.hostView);
        containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }

    private attachWindowComponent(
        containerEl: any,
        contentRef: any,
        component: any
    ): ComponentRef<any> {
        const windowFactory =
            this.factoryResolver.resolveComponentFactory(component);
        const windowCmptRef = windowFactory.create(
            this.injector,
            contentRef.nodes
        );
        this.applicationRef.attachView(windowCmptRef.hostView);
        containerEl.appendChild(windowCmptRef.location.nativeElement);
        return windowCmptRef;
    }

    private applyWindowOptions(windowInstance: any, options: any): void {
        this.windowAttributes.forEach((optionName: string) => {
            if (!isNil(options[optionName])) {
                windowInstance[optionName] = options[optionName];
            }
        });
    }

    private getContentRef(
        moduleCFR: ComponentFactoryResolver,
        contentInjector: Injector,
        content: any,
        context: NuiActiveDialog
    ): ContentRef {
        if (!content) {
            return new ContentRef([]);
        } else if (content instanceof TemplateRef) {
            return this.createFromTemplateRef(content, context);
        } else if (typeof content === "string") {
            return this.createFromString(content);
        } else {
            return this.createFromComponent(
                moduleCFR,
                contentInjector,
                content,
                context
            );
        }
    }

    private createFromTemplateRef(
        content: TemplateRef<any>,
        context: NuiActiveDialog
    ): ContentRef {
        const viewRef = content.createEmbeddedView(context);
        this.applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }

    private createFromString(content: string): ContentRef {
        const component = this.document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }

    private createFromComponent(
        moduleCFR: ComponentFactoryResolver,
        contentInjector: Injector,
        content: any,
        context: NuiActiveDialog
    ): ContentRef {
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        const dialogContentInjector = Injector.create({
            providers: [{ provide: NuiActiveDialog, useValue: context }],
            parent: contentInjector,
        });
        const componentRef = contentCmptFactory.create(dialogContentInjector);
        this.applicationRef.attachView(componentRef.hostView);
        return new ContentRef(
            [[componentRef.location.nativeElement]],
            componentRef.hostView,
            componentRef
        );
    }
}
