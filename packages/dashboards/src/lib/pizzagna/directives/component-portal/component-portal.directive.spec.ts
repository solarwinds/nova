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

import { PortalModule } from "@angular/cdk/portal";
import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    Directive,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
} from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";

import { ComponentPortalDirective } from "./component-portal.directive";
import { mockLoggerService } from "../../../mocks.spec";
import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { IStaticProviders } from "../../../services/types";
import { IConfigurable, IProperties } from "../../../types";
import { ComponentRegistryService } from "../../services/component-registry.service";

@Directive()
class MockProvider implements IConfigurable, OnInit, AfterViewInit, OnDestroy {
    public setComponent(component: any): void {}

    public updateConfiguration(properties: IProperties): void {}

    public ngOnInit(): void {}

    public ngAfterViewInit(): void {}

    public ngOnDestroy(): void {}
}

@Directive()
class MockProviderWithProperties extends MockProvider {
    public properties: IProperties = {};
}

@Component({
    template: ``,
    standalone: false,
})
class Mock1Component implements OnChanges {
    public static lateLoadKey = "Mock1Component";
    public componentId?: string;

    @Input() public testProp: string;
    @Output() public testOutput = new EventEmitter<boolean>();

    constructor(public changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {}
}

@Component({
    template: ``,
    standalone: false,
})
class Mock2Component implements OnChanges {
    public static lateLoadKey = "Mock2Component";

    @Input() public testProp: string;
    @Output() public testOutput = new EventEmitter<boolean>();

    constructor(public changeDetector: ChangeDetectorRef) {}

    public ngOnChanges(changes: SimpleChanges): void {}
}

@Component({
    template: `<ng-container
        nuiComponentPortal
        componentType="Mock1Component"
        [outputs]="['testOutput']"
        #componentPortal="nuiComponentPortal"
    >
        <ng-template
            [cdkPortalOutlet]="componentPortal.portal"
            (attached)="componentPortal.attached($event)"
        ></ng-template>
    </ng-container>`,
    standalone: false,
})
class ComponentPortalTestComponent {}

describe("ComponentPortalDirective >", () => {
    let mockComponentRef: ComponentRef<Mock1Component>;
    let mockComponentInstance: Mock1Component;
    let componentPortalDirective: ComponentPortalDirective;
    let providerRegistry: ProviderRegistryService;
    let fixture: ComponentFixture<ComponentPortalTestComponent>;
    let componentRegistryService: ComponentRegistryService;

    beforeEach(() => {
        providerRegistry = new ProviderRegistryService(mockLoggerService);
        componentRegistryService = new ComponentRegistryService(
            mockLoggerService
        );
        componentRegistryService.registerByLateLoadKey(Mock1Component);
        componentRegistryService.registerByLateLoadKey(Mock2Component);

        TestBed.configureTestingModule({
            imports: [PortalModule],
            declarations: [
                ComponentPortalTestComponent,
                ComponentPortalDirective,
                Mock1Component,
                Mock2Component,
            ],
            providers: [
                {
                    provide: ComponentRegistryService,
                    useValue: componentRegistryService,
                },
                {
                    provide: ProviderRegistryService,
                    useValue: providerRegistry,
                },
                ComponentPortalDirective,
            ],
        });
        fixture = TestBed.createComponent(ComponentPortalTestComponent);
        const mockComponentFixture = TestBed.createComponent(Mock1Component);
        mockComponentRef = mockComponentFixture.componentRef;
        mockComponentInstance = mockComponentFixture.componentInstance;
        componentPortalDirective =
            fixture.debugElement.childNodes[0].injector.get<ComponentPortalDirective>(
                ComponentPortalDirective
            );
    });

    it("should create", () => {
        expect(componentPortalDirective).toBeTruthy();
    });

    describe("ngOnInit > ", () => {
        it("should recreate the portal", () => {
            fixture.detectChanges();
            const oldPortal = componentPortalDirective.portal;
            componentPortalDirective.ngOnInit();
            expect(componentPortalDirective.portal).not.toBe(oldPortal);
        });

        it("should emit the propertiesChanges subject when recreating portal", () => {
            const applyPropertiesChangeSpy = spyOn(
                <any>componentPortalDirective,
                "applyPropertiesChange"
            );
            componentPortalDirective.properties = {
                property: "value",
                property2: "value2",
            };
            fixture.detectChanges();
            componentPortalDirective.ngOnInit();
            expect(applyPropertiesChangeSpy).toHaveBeenCalledTimes(2);
        });
    });

    describe("ngAfterViewInit > ", () => {
        it("should invoke ngAfterViewInit on each of the providers", (): void => {
            fixture.detectChanges();
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                },
            };
            providerRegistry.setProviders({
                [providerId]: {
                    provide: MockProvider,
                    deps: [],
                },
            });
            componentPortalDirective.ngOnInit();
            const spy = spyOn(
                (<any>componentPortalDirective).providerInstances[providerId],
                "ngAfterViewInit"
            );
            componentPortalDirective.ngAfterViewInit();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe("ngOnChanges > ", () => {
        it("should not recreate the portal if the providers do not change", () => {
            const previousProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const newProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            componentPortalDirective.providers = newProviders;
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            (<any>componentPortalDirective).providerInstances = {
                provider1: {},
                provider2: {},
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).not.toHaveBeenCalled();
        });

        it("should recreate the portal if a provider key changes", () => {
            const previousProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const newProviders = {
                changedProviderKey: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should recreate the portal if a provider id changes", () => {
            const previousProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const newProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "changedProviderId",
                },
            };
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should recreate the portal if the number of providers increases", () => {
            const previousProviders = {
                provider1: {
                    providerId: "provider1",
                },
            };
            const newProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should recreate the portal if the number of providers decreases", () => {
            const previousProviders = {
                provider1: {
                    providerId: "provider1",
                },
                provider2: {
                    providerId: "provider2",
                },
            };
            const newProviders = {
                provider1: {
                    providerId: "provider1",
                },
            };
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should not recreate the portal if the order of providers changes", () => {
            const provider1Id = "provider1";
            const provider2Id = "provider2";
            const previousProviders = {
                provider1: {
                    providerId: provider1Id,
                },
                provider2: {
                    providerId: provider2Id,
                },
            };
            const newProviders = {
                provider2: {
                    providerId: provider2Id,
                },
                provider1: {
                    providerId: provider1Id,
                },
            };
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.providers = newProviders;
            providerRegistry.setProviders({
                [provider1Id]: {
                    provide: MockProvider,
                    deps: [],
                },
                [provider2Id]: {
                    provide: MockProvider,
                    deps: [],
                },
            });
            fixture.detectChanges();
            componentPortalDirective.ngOnInit();

            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).not.toHaveBeenCalled();
        });

        it("should update the provider configurations if the providers themselves do not change but their properties change", () => {
            const providerId = "provider1";
            const previousProviders = {
                provider1: {
                    providerId,
                    properties: {
                        value: "initial value",
                    },
                },
            };
            const newProviders = {
                provider1: {
                    providerId,
                    properties: {
                        value: "new value",
                    },
                },
            };
            componentPortalDirective.providers = newProviders;
            const changes: SimpleChanges = {
                providers: {
                    previousValue: previousProviders,
                    currentValue: newProviders,
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            providerRegistry.setProviders({
                [providerId]: {
                    provide: MockProvider,
                    deps: [],
                },
            });
            fixture.detectChanges();
            componentPortalDirective.ngOnInit();
            const spy = spyOn(
                (<any>componentPortalDirective).providerInstances[providerId],
                "updateConfiguration"
            );
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalled();
        });

        it("should recreate the portal if the componentType changes", () => {
            const changes: SimpleChanges = {
                componentType: {
                    previousValue: "PreviousComponentType",
                    currentValue: "NewComponentType",
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should not recreate the portal if the componentType changes but it's the first change", () => {
            const changes: SimpleChanges = {
                componentType: {
                    previousValue: "PreviousComponentType",
                    currentValue: "NewComponentType",
                    isFirstChange: () => true,
                    firstChange: true,
                },
            };
            const spy = spyOn(<any>componentPortalDirective, "recreatePortal");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(0);
        });

        it("should emit the propertiesChanges subject", () => {
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        property: "value",
                    },
                    currentValue: {
                        property: "new value",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            const spy = spyOn(
                (<any>componentPortalDirective).propertiesChanges,
                "next"
            );
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledTimes(1);
        });

        it("should recreate the portal and emit the propertiesChanges subject if both the componentType and properties change", () => {
            const changes: SimpleChanges = {
                componentType: {
                    previousValue: "Mock1Component",
                    currentValue: "Mock2Component",
                    isFirstChange: () => false,
                    firstChange: false,
                },
                properties: {
                    previousValue: {
                        property: "value",
                    },
                    currentValue: {
                        property: "new value",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            fixture.detectChanges();
            const recreateSpy = spyOn(
                <any>componentPortalDirective,
                "recreatePortal"
            ).and.callThrough();
            const applyPropertiesChangeSpy = spyOn(
                <any>componentPortalDirective,
                "applyPropertiesChange"
            );
            componentPortalDirective.ngOnChanges(changes);
            fixture.detectChanges();
            expect(recreateSpy).toHaveBeenCalledTimes(1);
            expect(applyPropertiesChangeSpy).toHaveBeenCalledTimes(1);
        });

        it("should update the values of a newly attached component", () => {
            const changes1: SimpleChanges = {
                componentType: {
                    previousValue: "Mock1Component",
                    currentValue: "Mock2Component",
                    isFirstChange: () => false,
                    firstChange: false,
                },
                properties: {
                    previousValue: {
                        testProp: "value",
                    },
                    currentValue: {
                        testProp: "new value 1",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            const changes2: SimpleChanges = {
                componentType: {
                    previousValue: "Mock2Component",
                    currentValue: "Mock1Component",
                    isFirstChange: () => false,
                    firstChange: false,
                },
                properties: {
                    previousValue: {
                        testProp: "value",
                    },
                    currentValue: {
                        testProp: "new value 2",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };

            // set up the initial component
            fixture.detectChanges();
            componentPortalDirective.ngOnChanges(changes1);
            fixture.detectChanges();

            // change out the component
            const oldComponent = (<any>componentPortalDirective).component;
            componentPortalDirective.ngOnChanges(changes2);
            fixture.detectChanges();
            expect((<any>componentPortalDirective).component).not.toBe(
                oldComponent
            );
            expect((<any>componentPortalDirective).component.testProp).toEqual(
                changes2.properties.currentValue.testProp
            );
        });
    });

    describe("ngOnDestroy", () => {
        it("should destroy the providers", () => {
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                },
            };
            providerRegistry.setProviders({
                [providerId]: {
                    provide: MockProvider,
                    deps: [],
                },
            });

            fixture.detectChanges();
            componentPortalDirective.ngOnInit();
            expect(
                (<any>componentPortalDirective).providerInstances[providerId]
            ).toBeTruthy();
            const spy = spyOn(
                (<any>componentPortalDirective).providerInstances[providerId],
                "ngOnDestroy"
            );
            componentPortalDirective.ngOnDestroy();
            expect(spy).toHaveBeenCalled();
            expect(
                (<any>componentPortalDirective).providerInstances[providerId]
            ).toBeUndefined();
        });

        it("should emit and complete the destroy$ subject", () => {
            const nextSpy = spyOn(
                (<any>componentPortalDirective).destroy$,
                "next"
            );
            const completeSpy = spyOn(
                (<any>componentPortalDirective).destroy$,
                "complete"
            );
            componentPortalDirective.ngOnDestroy();
            expect(nextSpy).toHaveBeenCalled();
            expect(completeSpy).toHaveBeenCalled();
        });
    });

    describe("attached >", () => {
        it("should assign the component instance", () => {
            expect((<any>componentPortalDirective).component).toBeUndefined();
            componentPortalDirective.attached(mockComponentRef);
            expect(
                (<any>componentPortalDirective).component instanceof
                    Mock1Component
            ).toEqual(true);
        });

        it("should set the component instance on each of the providers", () => {
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                },
            };
            providerRegistry.setProviders({
                [providerId]: {
                    provide: MockProvider,
                    deps: [],
                },
            });

            fixture.detectChanges();
            componentPortalDirective.ngOnInit();
            const spy = spyOn(
                (<any>componentPortalDirective).providerInstances[providerId],
                "setComponent"
            );
            componentPortalDirective.attached(mockComponentRef);
            expect(spy).toHaveBeenCalledWith(
                (<any>componentPortalDirective).component,
                (<any>componentPortalDirective).componentId
            );
        });

        it("should subscribe the component instance to properties changes which results in updating the component instance properties", () => {
            const newValue = "new value";
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    currentValue: {
                        testProp: newValue,
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.properties =
                changes.properties.currentValue;
            componentPortalDirective.attached(mockComponentRef);
            componentPortalDirective.ngOnChanges(changes);
            expect((<any>componentPortalDirective).component.testProp).toEqual(
                newValue
            );
        });

        it("should subscribe the component instance to properties changes which results in the invocation of the component's ngOnChanges", (): void => {
            const newValue = "new value";
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    currentValue: {
                        testProp: newValue,
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.properties =
                changes.properties.currentValue;
            const componentChanges = {
                testProp: new SimpleChange(
                    changes.properties.previousValue.testProp,
                    changes.properties.currentValue.testProp,
                    changes.properties.isFirstChange()
                ),
            };
            const spy = spyOn(mockComponentInstance, "ngOnChanges");
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).not.toHaveBeenCalled();
            componentPortalDirective.attached(mockComponentRef);
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalledWith(componentChanges);
        });

        it("should subscribe the component instance to properties changes which results in appending the componentId to the component instance", () => {
            const testComponentId = "testComponentId";
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    currentValue: {
                        testProp: "new value",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.properties =
                changes.properties.currentValue;
            componentPortalDirective.componentId = testComponentId;
            expect(mockComponentInstance["componentId"]).toBeUndefined();
            componentPortalDirective.attached(mockComponentRef);
            componentPortalDirective.ngOnChanges(changes);
            expect(mockComponentInstance["componentId"]).toEqual(
                testComponentId
            );
        });

        it("should subscribe the component instance to properties changes which results in invoking the component instance change detector", () => {
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    currentValue: {
                        testProp: "new value",
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.properties =
                changes.properties.currentValue;
            const spy = spyOn(
                mockComponentInstance.changeDetector,
                "markForCheck"
            );
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).not.toHaveBeenCalled();
            componentPortalDirective.attached(mockComponentRef);
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).toHaveBeenCalled();
        });

        it(`should subscribe the component instance to properties changes and this should not invoke the component instance change detector
            if the property value doesn't change`, () => {
            const changes: SimpleChanges = {
                properties: {
                    previousValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    currentValue: {
                        testProp: mockComponentInstance.testProp,
                    },
                    isFirstChange: () => false,
                    firstChange: false,
                },
            };
            componentPortalDirective.properties =
                changes.properties.currentValue;
            const spy = spyOn(
                mockComponentInstance.changeDetector,
                "markForCheck"
            );
            componentPortalDirective.attached(mockComponentRef);
            componentPortalDirective.ngOnChanges(changes);
            expect(spy).not.toHaveBeenCalled();
        });

        it(`should subscribe to the component instance outputs`, () => {
            fixture.detectChanges();
            const spy = spyOn((<any>componentPortalDirective).output, "emit");
            componentPortalDirective.attached(mockComponentRef);
            (<any>componentPortalDirective).component.testOutput.emit(false);
            expect(spy).toHaveBeenCalledWith({
                id: "testOutput",
                payload: false,
            });
        });
    });

    describe("updateProviders > ", () => {
        it("should not invoke the provider's updateConfiguration on the provider instance if its properties are undefined", () => {
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                },
            };
            const registeredProviders: IStaticProviders = {
                [providerId]: {
                    provide: MockProvider,
                    deps: [],
                },
            };
            providerRegistry.setProviders(registeredProviders);

            const spy = spyOn(MockProvider.prototype, "updateConfiguration");
            (<any>componentPortalDirective).updateProviders(
                (<any>componentPortalDirective).injector
            );
            expect(spy).not.toHaveBeenCalled();
        });

        it("should invoke the provider's updateConfiguration if properties are defined on the provider instance and on the provider config", () => {
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                    properties: {},
                },
            };
            const registeredProviders: IStaticProviders = {
                [providerId]: {
                    provide: MockProviderWithProperties,
                    deps: [],
                },
            };
            providerRegistry.setProviders(registeredProviders);

            const spy = spyOn(
                MockProviderWithProperties.prototype,
                "updateConfiguration"
            );
            (<any>componentPortalDirective).updateProviders(
                (<any>componentPortalDirective).injector
            );
            expect(spy).toHaveBeenCalled();
        });

        it("should not invoke the provider's updateConfiguration if properties are defined on the provider instance but not on the provider config", () => {
            const providerId = "provider1";
            componentPortalDirective.providers = {
                provider1: {
                    providerId,
                },
            };
            const registeredProviders: IStaticProviders = {
                [providerId]: {
                    provide: MockProviderWithProperties,
                    deps: [],
                },
            };
            providerRegistry.setProviders(registeredProviders);

            const spy = spyOn(
                MockProviderWithProperties.prototype,
                "updateConfiguration"
            );
            (<any>componentPortalDirective).updateProviders(
                (<any>componentPortalDirective).injector
            );
            expect(spy).not.toHaveBeenCalled();
        });
    });
});
