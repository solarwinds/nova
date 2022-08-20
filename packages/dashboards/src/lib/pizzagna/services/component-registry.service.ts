import { Injectable, Type } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";

// Extending with Type<any> to be compatible with EntryComponents type
export interface IComponentWithLateLoadKey extends Type<any> {
    lateLoadKey: string;
}

@Injectable({
    providedIn: "root",
})
export class ComponentRegistryService {
    private components: Record<string, any> = {};

    constructor(private logger: LoggerService) {}

    public registerByLateLoadKey(component: IComponentWithLateLoadKey) {
        this.registerComponentType(component.lateLoadKey, component);
    }

    public registerComponentType(key: string, component: any) {
        this.components[key] = component;
    }

    public getComponentType(key: string) {
        const component = this.components[key];

        if (!component) {
            this.logger.warn(
                "Component '" +
                    key +
                    "' not defined. Available components: " +
                    JSON.stringify(Object.keys(this.components))
            );
        }

        return component;
    }
}
