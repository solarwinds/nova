import { Injectable } from "@angular/core";

@Injectable({providedIn: "root"})
export class UnitTestRegistryService {
    public static providerId = "UnitTestRegistryService";
    public componentMap: any = {};
    public providersMap: any = {};

    setComponent(component: any, componentId: string) {
        this.componentMap[componentId] = component;
    }

    setProviders(services: any, componentId: string) {
        this.providersMap[componentId] = services;
    }
}
