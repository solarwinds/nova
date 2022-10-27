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
    ApplicationRef,
    ComponentFactoryResolver,
    ComponentRef,
    EmbeddedViewRef,
    Injectable,
} from "@angular/core";
import isNil from "lodash/isNil";

import { OverlayContainerService } from "../overlay/overlay-container.service";
import { OVERLAY_DEFAULT_PRIORITY } from "../overlay/types";
import { ToastInjector } from "./toast-injector";
/** @ignore */
interface IToastContainers {
    [positionClass: string]: HTMLElement;
}

/**
 * @ignore
 */
@Injectable({ providedIn: "root" })
export class ToastContainerService {
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private overlayService: OverlayContainerService,
        private appRef: ApplicationRef
    ) {}

    private static getComponentRootNode(
        componentRef: ComponentRef<any>
    ): HTMLElement {
        return (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
    }
    private containers: IToastContainers = {};
    private containerElement: HTMLElement;

    /**
     * Creates container element for position, if container already exists - returns it
     * @return the container element
     */
    public getContainerElement(
        positionClass: string = "toast-top-right"
    ): HTMLElement {
        if (isNil(this.containers[positionClass])) {
            this.createContainer(positionClass);
        }

        return (this.containerElement = this.containers[positionClass]);
    }

    /**
     * Dynamically compiles toast component and attaches it to the toast container
     * @return reference to attached toast
     */
    public attachToast(
        component: any,
        injector: ToastInjector,
        newestOnTop: boolean
    ): any {
        const componentFactory =
            this.componentFactoryResolver.resolveComponentFactory(component);
        const componentRef = componentFactory.create(injector);

        this.appRef.attachView(componentRef.hostView);

        if (newestOnTop) {
            this.containerElement.insertBefore(
                ToastContainerService.getComponentRootNode(componentRef),
                this.containerElement.firstChild
            );
        } else {
            this.containerElement.appendChild(
                ToastContainerService.getComponentRootNode(componentRef)
            );
        }

        return componentRef;
    }

    /**
     * Destroys component using reference to it's factory
     * @return reference to attached toast
     */
    public detachToast(component: any): void {
        component.destroy();
    }

    private createContainer(positionClass: string): void {
        const container = document.createElement("div");
        container.classList.add("nui-toast__container");
        container.classList.add(positionClass);
        this.overlayService
            // make sure toasts are always displayed on top of everything
            .getOverlayContainer(document.body, OVERLAY_DEFAULT_PRIORITY + 10)
            .appendChild(container);

        this.containers[positionClass] = container;
    }
}
