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

import { Injectable } from "@angular/core";

import { immutableSet } from "@nova-ui/bits";

import { IComponentConfiguration, IPizzagna, PizzagnaLayer } from "../../types";

// TODO: make it dynamic!
const CHILD_ELEM_COMPONENT_TYPE = "WidgetConfiguratorSectionComponent";

@Injectable()
export class DynamicComponentCreator {
    public getPizzagnaUpdatedWithComponents(
        pizzagna: IPizzagna,
        parentPath: string,
        componentIds: string[]
    ) {
        const parent = pizzagna[PizzagnaLayer.Structure][parentPath];
        const template = parent.properties
            ?.template as Partial<IComponentConfiguration>[];

        return this.getPizzagnaWithChildren(
            pizzagna,
            componentIds,
            template,
            parentPath
        );
    }

    private getPizzagnaWithChildren(
        pizzagna: IPizzagna,
        componentIds: string[],
        template: Partial<IComponentConfiguration>[],
        parentPath: string
    ) {
        const children = componentIds.map((id) => ({
            id,
            componentType: CHILD_ELEM_COMPONENT_TYPE,
        })) as IComponentConfiguration[];

        let updatedPizzagna = children.reduce(
            (res, child) => this.updateChildPizzagna(res, template, child),
            pizzagna
        );
        updatedPizzagna = this.getPizzagnaWithNodesSet(
            updatedPizzagna,
            parentPath,
            componentIds
        );

        return updatedPizzagna;
    }

    private updateChildPizzagna(
        pizzagna: IPizzagna,
        template: Partial<IComponentConfiguration>[],
        child: IComponentConfiguration
    ) {
        let updatedPizzagna = immutableSet(
            pizzagna,
            `${PizzagnaLayer.Structure}.${child.id}`,
            child
        );

        const nodes = template.map((node) => ({
            ...node,
            id: `${child.id}/${node.id}`,
        }));
        updatedPizzagna = nodes.reduce(
            (res, node) =>
                immutableSet(
                    res,
                    `${PizzagnaLayer.Structure}.${node.id}`,
                    node
                ),
            updatedPizzagna
        );

        const nodesIDs = nodes.map((node) => node.id);
        updatedPizzagna = this.getPizzagnaWithNodesSet(
            updatedPizzagna,
            child.id,
            nodesIDs
        );

        return updatedPizzagna;
    }

    private getPizzagnaWithNodesSet(
        pizzagna: IPizzagna,
        componentId: string,
        nodes: string[]
    ) {
        const path = `${PizzagnaLayer.Structure}.${componentId}.properties.nodes`;

        return immutableSet(pizzagna, path, nodes);
    }
}
