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
