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

import { Portal } from "@angular/cdk/portal";
import {
    AfterViewInit,
    ComponentRef,
    Directive,
    EventEmitter,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    Renderer2,
    SimpleChange,
    SimpleChanges,
    StaticProvider,
} from "@angular/core";
import isArray from "lodash/isArray";
import values from "lodash/values";
import xor from "lodash/xor";
import { ReplaySubject, Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { IEvent, LoggerService } from "@nova-ui/bits";

import { ProviderRegistryService } from "../../../services/provider-registry.service";
import { IConfigurable, IProviderConfiguration } from "../../../types";
import { ComponentPortalService } from "../../services/component-portal.service";

@Directive({
    selector: "[nuiComponentPortal]",
    exportAs: "nuiComponentPortal",
})
export class ComponentPortalDirective
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    @Input() public componentId: string;
    @Input() public componentType: string | Function;
    @Input() public properties: Record<string, any>;
    @Input() public providers: Record<string, IProviderConfiguration>;
    @Input() public outputs: string[];

    @Output() public output = new EventEmitter<IEvent>();

    public portal: Portal<any>;
    private component: any;
    private propertiesChanges = new ReplaySubject<SimpleChange>();
    private providerInstances: Record<string, any> = {};
    private readonly destroy$ = new Subject<void>();
    private changesSubscription?: Subscription;

    constructor(
        private injector: Injector,
        private logger: LoggerService,
        private portalService: ComponentPortalService,
        private renderer: Renderer2,
        private providerRegistry: ProviderRegistryService
    ) {}

    public ngOnInit(): void {
        this.logger.debug("Portal created:", this.componentId);
        this.recreatePortal();
    }

    public ngAfterViewInit(): void {
        Object.keys(this.providerInstances).forEach((key) => {
            const provider = this.providerInstances[key];
            if (provider.ngAfterViewInit) {
                provider.ngAfterViewInit();
            }
        });
    }

    public ngOnChanges(changes: SimpleChanges): void {
        let recreated = false;
        const providersChange = changes.providers;

        if (providersChange && !providersChange.isFirstChange()) {
            if (this.checkForProviderChanges(providersChange)) {
                this.logger.debug(
                    "Portal recreated (provider change):",
                    this.componentId
                );
                this.recreatePortal();
                recreated = true; // we want to prevent multiple recreations within one ngOnChanges cycle
            } else {
                this.updateProviderConfigurations(providersChange);
            }
        }

        if (
            changes.componentType &&
            !changes.componentType.isFirstChange() &&
            !recreated
        ) {
            this.logger.debug(
                "Portal recreated (component change):",
                this.componentId
            );
            this.recreatePortal();
        }

        if (changes.properties) {
            this.propertiesChanges.next(changes.properties);
        }
    }

    public ngOnDestroy(): void {
        this.logger.debug("Portal destroyed:", this.componentId);

        this.destroyProviders();

        this.destroy$.next();
        this.destroy$.complete();
    }

    public attached(componentRef: ComponentRef<any>): void {
        this.component = componentRef.instance;

        // ctrl+shift+click on a pizzagna to get a dump of its properties
        // this will propagate through the parent components, so it should dump the parent pizzagnas as well
        this.renderer.listen(
            componentRef.location.nativeElement,
            "click",
            (event: MouseEvent) => {
                // event.metaKey is a CMD key for Mac
                if (
                    (event.ctrlKey || event.metaKey) &&
                    event.shiftKey &&
                    event.button === 0
                ) {
                    console.log(
                        "==================== PIZZAGNA DUMP ========================="
                    );
                    console.log("componentId:", this.componentId);
                    console.log("component:", this.component);
                    console.log("componentType:", this.componentType);
                    console.log("properties:", this.properties);
                    console.log("providers:", this.providers);
                    console.log("providerInstances:", this.providerInstances);
                    console.log(
                        "============================================================"
                    );
                }
            }
        );

        for (const key of Object.keys(this.providerInstances)) {
            const provider = this.providerInstances[key];
            if (provider.setComponent) {
                // setting componentId separately because "componentId" is used as another input,
                // at the moment of setting the component here, 'this.component' doesn't have 'componentId' property,
                // because 'changesSubscription' has not received any changes. it leads to the issue
                // when providers do not know the ID until component property changed
                provider.setComponent(this.component, this.componentId);
            }
            if (provider.setProviders) {
                provider.setProviders(this.providerInstances, this.componentId);
            }
        }

        this.subscribeToOutputs();

        this.changesSubscription = this.propertiesChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((change) => this.applyPropertiesChange(change));
    }

    private recreatePortal() {
        if (this.changesSubscription) {
            this.changesSubscription.unsubscribe();
            this.changesSubscription = undefined;
            this.propertiesChanges = new ReplaySubject<SimpleChange>();
        }

        let injector = this.injector;

        this.destroyProviders();

        if (this.providers) {
            injector = this.updateProviders(injector);
        }

        this.portal = this.portalService.createComponentPortal(
            this.componentType,
            injector
        );

        // apply initial property values to the freshly (re)created component
        if (this.properties) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            for (const key of Object.keys(this.properties)) {
                this.propertiesChanges.next(
                    new SimpleChange(undefined, this.properties, true)
                );
            }
        }
    }

    private updateProviders(injector: Injector) {
        const providerKeys = Object.keys(this.providers);
        const registeredProviders = providerKeys.reduce((acc, next) => {
            // for cases when providerId is just empty string, null or undefined (for example adding a tile doesn't provide a DS to it)
            if (this.providers[next].providerId) {
                acc[next] = this.providerRegistry.getProvider(
                    this.providers[next].providerId
                );
            }
            return acc;
        }, {} as Record<string, StaticProvider>);

        const portalInjector = this.portalService.createInjector({
            injector: injector,
            providers: values(registeredProviders),
        });

        this.providerInstances = providerKeys.reduce((acc, next) => {
            const registeredProvider = registeredProviders[next] as any;
            const providerConfig = this.providers[next];
            if (registeredProvider) {
                // TODO: Why do we pass null to the injectFlags parameter?
                // TODO: How to retrieve info about the provider options to inject?InjectOptions
                const injections = portalInjector.get(
                    registeredProvider.provide,
                    null
                );
                const providerInstance = isArray(injections)
                    ? (injections as any).find(
                          (v: any) => v instanceof registeredProvider.useClass
                      )
                    : injections;

                if (!providerInstance) {
                    throw new Error("Provider '" + next + "' does not exist.");
                }
                if (
                    providerInstance.updateConfiguration &&
                    providerConfig.properties
                ) {
                    providerInstance.updateConfiguration({
                        providerKey: next,
                        ...(providerConfig.properties || {}),
                    });
                }
                providerInstance.providerKey = next;

                acc[next] = providerInstance;
            } else if (providerConfig.providerId) {
                this.logger.error(
                    "There's no registered provider for id",
                    next
                );
            }
            return acc;
        }, this.providerInstances);

        for (const key of Object.keys(this.providerInstances)) {
            const pi = this.providerInstances[key];
            if (pi.ngOnInit) {
                pi.ngOnInit();
            }
        }

        return portalInjector;
    }

    private updateProviderConfigurations(providersChange: SimpleChange) {
        for (const providerKey of Object.keys(this.providers)) {
            // for cases when providerId is just empty string, null or undefined (for example adding a tile doesn't provide a DS to it)
            if (!this.providers[providerKey].providerId) {
                return;
            }
            const providerInstance = this.providerInstances[providerKey];
            if (!providerInstance) {
                throw new Error(
                    "Provider '" + providerKey + "' does not exist."
                );
            }

            const previousValue = providersChange.previousValue[providerKey];
            const currentValue = providersChange.currentValue[providerKey];

            const previousProperties =
                previousValue && previousValue.properties;
            const currentProperties = currentValue && currentValue.properties;

            if (
                previousProperties !== currentProperties &&
                providerInstance.updateConfiguration
            ) {
                (providerInstance as IConfigurable).updateConfiguration({
                    providerKey,
                    ...currentProperties,
                });
            }
        }
    }

    private subscribeToOutputs() {
        if (!this.outputs) {
            return;
        }

        for (const output of this.outputs.filter(
            (o) => this.component[o] instanceof EventEmitter
        )) {
            this.component[output]
                .pipe(takeUntil(this.destroy$))
                .subscribe(($event: any) => {
                    this.output.emit({
                        id: output,
                        payload: $event,
                    });
                });
        }
    }

    private checkForProviderChanges(change: SimpleChange): boolean {
        const previousKeys = change.previousValue
            ? Object.keys(change.previousValue)
            : [];
        const currentKeys = change.currentValue
            ? Object.keys(change.currentValue)
            : [];
        if (
            previousKeys.length !== currentKeys.length ||
            xor(previousKeys, currentKeys).length > 0
        ) {
            return true;
        }

        const previousIds = Object.keys(change.previousValue).map(
            (key: string) => change.previousValue[key].providerId
        );
        const currentIds = Object.keys(change.currentValue).map(
            (key: string) => change.currentValue[key].providerId
        );
        if (xor(previousIds, currentIds).length > 0) {
            return true;
        }

        return false;
    }

    private destroyProviders() {
        if (this.providerInstances) {
            for (const piKey of Object.keys(this.providerInstances)) {
                const providerInstance = this.providerInstances[piKey];
                if (providerInstance.ngOnDestroy) {
                    providerInstance.ngOnDestroy();
                }
                delete this.providerInstances[piKey];
            }
        }
    }

    /**
     * There was a change in component properties, so we need to handle that here
     *
     * @param change a change of the `properties` input
     */
    private applyPropertiesChange(change: SimpleChange) {
        let properties = change.currentValue;
        if (!properties) {
            return;
        }

        // we add componentId to the mix, so components will be able to use it
        properties = {
            ...properties,
            componentId: this.componentId,
        };

        const changes: SimpleChanges = {};
        let changeHappened = false;
        for (const key of Object.keys(properties)) {
            const previousValue = this.component[key];

            // reference based change detection in action here!
            if (properties[key] !== previousValue) {
                changeHappened = true;
                this.component[key] = properties[key];
                // we're simulating angular by calling ngOnChanges manually
                if (this.component.ngOnChanges) {
                    changes[key] = new SimpleChange(
                        previousValue,
                        properties[key],
                        change.isFirstChange()
                    );
                }
            }
        }

        if (changeHappened) {
            if (this.component.ngOnChanges) {
                this.component.ngOnChanges(changes);
            }
            const changeDetector = this.component.changeDetector;
            if (changeDetector) {
                changeDetector.markForCheck();
            } else {
                this.logger.warn(
                    `Property 'changeDetector' is missing on component '${this.componentType}',` +
                        ` so dynamic refresh of given component might not work.`
                );
            }
        }
    }
}
