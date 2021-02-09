import { InjectFlags, InjectionToken, Injector, Type } from "@angular/core";
import { EventBus, IEvent } from "@nova-ui/bits";

import { mockLoggerService } from "../../mocks";

import { ComponentPortalService } from "./component-portal.service";
import { ComponentRegistryService } from "./component-registry.service";

class MockComponent {
    public static lateLoadKey = "MockComponent";
}

class MockInjector implements Injector {
    public get<T>(token: Type<T> | InjectionToken<T>, notFoundValue?: T, flags?: InjectFlags): T {
        // @ts-ignore: Suppressed for test purposes
        return null;
    }
}

describe("ComponentPortalService > ", () => {
    let service: ComponentPortalService;
    let eventBus: EventBus<IEvent>;
    let componentRegistry: ComponentRegistryService;

    beforeEach(() => {
        componentRegistry = new ComponentRegistryService(mockLoggerService);
        eventBus = new EventBus<IEvent>();
        service = new ComponentPortalService(componentRegistry, mockLoggerService);
    });

    describe("createComponentPortal > ", () => {
        beforeEach(() => {
            componentRegistry.registerByLateLoadKey(MockComponent);
        });

        it("should return a component portal for the specified string argument", () => {
            const portal = service.createComponentPortal(MockComponent.lateLoadKey, null);
            expect(portal.component.name).toEqual(MockComponent.lateLoadKey);
        });

        it("should return a component portal for the specified component type argument", () => {
            const portal = service.createComponentPortal(MockComponent, null);
            expect(portal.component.name).toEqual(MockComponent.lateLoadKey);
        });

        it("should return a component portal for the TemplateLoadErrorComponent", () => {
            const portal = service.createComponentPortal("NonExistentComponent", null);
            expect(portal.component.name).toEqual("TemplateLoadErrorComponent");
        });
    });

    describe("createInjector > ", () => {
        it("should create an Injector", () => {
            const injector = service.createInjector({});
            expect(injector).toBeTruthy();
        });

        it("should assign a parent injector if specified", () => {
            const injector = service.createInjector({ injector: new MockInjector() });
            expect((<any>injector).parent.constructor.name).toEqual("MockInjector");
        });

        it("should assign providers if specified", () => {
            class MockProvider {
            }

            const provider = {
                provide: MockProvider,
                useValue: { mockValue: {} },
            };
            const injector = service.createInjector({ providers: [provider] });
            expect(injector.get(MockProvider)).toEqual(provider.useValue);
        });
    });
});
