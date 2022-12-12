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

import { InjectFlags, InjectionToken, Injector, Type } from "@angular/core";

import { mockLoggerService } from "../../mocks";
import { ComponentPortalService } from "./component-portal.service";
import { ComponentRegistryService } from "./component-registry.service";

class MockComponent {
    public static lateLoadKey = "MockComponent";
}

class MockInjector implements Injector {
    get(token: any, notFoundValue?: any): any {}
}

describe("ComponentPortalService > ", () => {
    let service: ComponentPortalService;
    let componentRegistry: ComponentRegistryService;

    beforeEach(() => {
        componentRegistry = new ComponentRegistryService(mockLoggerService);
        service = new ComponentPortalService(
            componentRegistry,
            mockLoggerService
        );
    });

    describe("createComponentPortal > ", () => {
        beforeEach(() => {
            componentRegistry.registerByLateLoadKey(MockComponent);
        });

        it("should return a component portal for the specified string argument", () => {
            const portal = service.createComponentPortal(
                MockComponent.lateLoadKey,
                null
            );
            expect(portal.component.name).toEqual(MockComponent.lateLoadKey);
        });

        it("should return a component portal for the specified component type argument", () => {
            const portal = service.createComponentPortal(MockComponent, null);
            expect(portal.component.name).toEqual(MockComponent.lateLoadKey);
        });

        it("should return a component portal for the TemplateLoadErrorComponent", () => {
            const portal = service.createComponentPortal(
                "NonExistentComponent",
                null
            );
            expect(portal.component.name).toEqual("TemplateLoadErrorComponent");
        });
    });

    describe("createInjector > ", () => {
        it("should create an Injector", () => {
            const injector = service.createInjector({});
            expect(injector).toBeTruthy();
        });

        it("should assign a parent injector if specified", () => {
            const injector = service.createInjector({
                injector: new MockInjector(),
            });
            expect((<any>injector).parent.constructor.name).toEqual(
                "MockInjector"
            );
        });

        it("should assign providers if specified", () => {
            class MockProvider {}

            const provider = {
                provide: MockProvider,
                useValue: { mockValue: {} },
            };
            const injector = service.createInjector({ providers: [provider] });
            expect(injector.get(MockProvider)).toEqual(provider.useValue);
        });
    });
});
