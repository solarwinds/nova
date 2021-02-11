import { Overlay, OverlayConfig } from "@angular/cdk/overlay";
import { CdkPortal } from "@angular/cdk/portal";
import { DOCUMENT } from "@angular/common";
import {
    ApplicationRef,
    ComponentFactory,
    ComponentFactoryResolver,
    ComponentRef,
    Inject,
    Injectable,
    Injector,
    TemplateRef
} from "@angular/core";
import isNil from "lodash/isNil";

import { ContentRef } from "../../services/content-ref";
import { OverlayComponent, OverlayContainerService } from "../overlay/public-api";

import { DialogBackdropComponent } from "./dialog-backdrop.component";
import { NuiActiveDialog, NuiDialogRef } from "./dialog-ref";
import { DialogComponent } from "./dialog.component";

/**
 * @dynamic
 * @ignore
 */
@Injectable({providedIn: "root"})
export class DialogStackService {
    private windowAttributes = ["backdrop", "keyboard", "size", "windowClass"];

    constructor(private applicationRef: ApplicationRef, private injector: Injector,
                private factoryResolver: ComponentFactoryResolver,
                private overlayContainerService: OverlayContainerService,
                private overlay: Overlay,
                @Inject(DOCUMENT) private document: Document) {
    }

    open(moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any, options: any): NuiDialogRef {
        let containerEl: HTMLElement = options.container
                                            ? this.document.querySelector(options.container)
                                            : this.document.body;
        const activeDialog = new NuiActiveDialog();

        // This handles the case when the nui-dialog is being used within the nui-overlay based components
        if (options.useOverlay) {
            containerEl =
                options.container
                    ? this.document.querySelector(options.container)
                    : this.overlayContainerService.getOverlayContainer();
        }

        if (!containerEl) {
            throw new Error(`The specified dialog container '${options.container || "body"}' was not found in the DOM.`);
        }

        const contentRef = this.getContentRef(moduleCFR, options.injector || contentInjector, content, activeDialog);

        const backdropCmptRef: ComponentRef<DialogBackdropComponent> | undefined =
            options.backdrop !== false ? this.attachBackdrop(containerEl) : undefined;
        const windowCmptRef: ComponentRef<DialogComponent> = this.attachWindowComponent(containerEl, contentRef, DialogComponent);
        
        activeDialog.close = (result: any) => { nuiDialogRef.close(result); };
        activeDialog.dismiss = (reason: any) => { nuiDialogRef.dismiss(reason); };
        
        this.applyWindowOptions(windowCmptRef.instance, options);
        
        const overlayReference = this.attachOverlay(windowCmptRef, backdropCmptRef);
        const nuiDialogRef: NuiDialogRef = new NuiDialogRef(windowCmptRef, contentRef, backdropCmptRef, options.beforeDismiss, overlayReference);
        console.log(">>>", overlayReference);

        return nuiDialogRef;
    }

    private attachOverlay(dialog: ComponentRef<DialogComponent>, backdrop: ComponentRef<DialogBackdropComponent> | undefined) {
        const overlayFactory: ComponentFactory<OverlayComponent> = this.factoryResolver.resolveComponentFactory(OverlayComponent);
        console.log(">>>", dialog.location.nativeElement);
        const overlayRef = overlayFactory.create(this.injector, [[backdrop?.location?.nativeElement, dialog.location.nativeElement]]);
        this.applicationRef.attachView(overlayRef.hostView);

        overlayRef.instance.overlayConfig = {
            ...overlayRef.instance.overlayConfig,
            positionStrategy: this.overlay.position().global(),
        };
        overlayRef.changeDetectorRef.detectChanges();
        overlayRef.instance.show();

        return overlayRef;
        // containerEl.appendChild(overlayRef.location.nativeElement);
    }

    private attachBackdrop(containerEl: any): ComponentRef<DialogBackdropComponent> {
        const backdropFactory: ComponentFactory<DialogBackdropComponent> =
            this.factoryResolver.resolveComponentFactory(DialogBackdropComponent);
        const backdropCmptRef = backdropFactory.create(this.injector);
        this.applicationRef.attachView(backdropCmptRef.hostView);
        // containerEl.appendChild(backdropCmptRef.location.nativeElement);
        return backdropCmptRef;
    }

    private attachWindowComponent(containerEl: any, contentRef: any, component: any): ComponentRef<any> {
        const windowFactory = this.factoryResolver.resolveComponentFactory(component);
        const windowCmptRef = windowFactory.create(this.injector, contentRef.nodes);
        this.applicationRef.attachView(windowCmptRef.hostView);
        // containerEl.appendChild(windowCmptRef.location.nativeElement);
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
        moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
        context: NuiActiveDialog): ContentRef {
        if (!content) {
            return new ContentRef([]);
        } else if (content instanceof TemplateRef) {
            return this.createFromTemplateRef(content, context);
        } else if (typeof content === "string") {
            return this.createFromString(content);
        } else {
            return this.createFromComponent(moduleCFR, contentInjector, content, context);
        }
    }

    private createFromTemplateRef(content: TemplateRef<any>, context: NuiActiveDialog): ContentRef {
        const viewRef = content.createEmbeddedView(context);
        this.applicationRef.attachView(viewRef);
        return new ContentRef([viewRef.rootNodes], viewRef);
    }

    private createFromString(content: string): ContentRef {
        const component = this.document.createTextNode(`${content}`);
        return new ContentRef([[component]]);
    }

    private createFromComponent(
        moduleCFR: ComponentFactoryResolver, contentInjector: Injector, content: any,
        context: NuiActiveDialog): ContentRef {
        const contentCmptFactory = moduleCFR.resolveComponentFactory(content);
        const dialogContentInjector =
            Injector.create({providers: [{provide: NuiActiveDialog, useValue: context}], parent: contentInjector});
        const componentRef = contentCmptFactory.create(dialogContentInjector);
        this.applicationRef.attachView(componentRef.hostView);
        return new ContentRef([[componentRef.location.nativeElement]], componentRef.hostView, componentRef);
    }
}
