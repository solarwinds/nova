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
    ChangeDetectorRef,
    DoCheck,
    Injectable,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChanges,
} from "@angular/core";
import { Subject } from "rxjs";

import { LoggerService } from "@nova-ui/bits";

import { IValueChange, mergeChanges } from "../../functions/merge-changes";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IComponentConfiguration, IHasChangeDetector } from "../../types";

@Injectable()
export abstract class BaseLayout
    implements IHasChangeDetector, OnChanges, DoCheck, OnDestroy
{
    // components config from 'pizza'
    public nodeComponentsConfigs: IComponentConfiguration[];
    // result config from merging 'nodeComponentsConfig' and parent 'template'
    public nodeConfigs: IComponentConfiguration[];

    protected destroyed$: Subject<void> = new Subject<void>();

    @Input() public template: Partial<IComponentConfiguration>;

    constructor(
        public changeDetector: ChangeDetectorRef,
        protected pizzagnaService: PizzagnaService,
        protected logger: LoggerService
    ) {}

    public abstract getNodes(): string[];

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.nodes || changes.template) {
            this.updateNodeConfigs({
                changesNodes: changes.nodes,
                changesTemplate: changes.template,
            });
        }
    }

    public ngDoCheck(): void {
        if (this.checkNodeConfigs()) {
            this.updateNodeConfigs();
            this.changeDetector.detectChanges();
        }
    }

    public ngOnDestroy(): void {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public trackByFn(index: number, node: IComponentConfiguration): string {
        return node.id;
    }

    private checkNodeConfigs(): boolean {
        const nodes = this.getNodes();

        if (
            !this.nodeComponentsConfigs ||
            nodes.length !== this.nodeComponentsConfigs.length
        ) {
            return true;
        }

        for (let i = 0; i < nodes.length; i++) {
            if (
                this.pizzagnaService.getComponent(nodes[i]) !==
                this.nodeComponentsConfigs[i]
            ) {
                return true;
            }
        }

        return false;
    }

    private updateNodeComponentConfigs() {
        const nodes = this.getNodes();

        this.nodeComponentsConfigs =
            nodes &&
            nodes.map((n) => {
                const c = this.pizzagnaService.getComponent(n);
                if (typeof c === "undefined") {
                    throw new Error(
                        "No component with id '" +
                            n +
                            "' was defined in the configuration."
                    );
                }
                return c;
            });
    }

    private updateNodeConfigs(changes?: SimpleChanges) {
        this.nodeConfigs = mergeChanges(
            this.nodeConfigs,
            this.getTemplateChangeForNodes(changes),
            this.getNodeComponentsConfigs()
        );
    }

    private getNodeComponentsConfigs() {
        const nodeComponentsConfigsChanges: IValueChange = {
            currentValue: undefined,
            previousValue: this.nodeComponentsConfigs
                ? [...this.nodeComponentsConfigs]
                : undefined,
        };
        this.updateNodeComponentConfigs();
        nodeComponentsConfigsChanges.currentValue = this.nodeComponentsConfigs;

        return nodeComponentsConfigsChanges;
    }

    private getTemplateChangeForNodes(changes?: SimpleChanges): IValueChange {
        const { changesNodes, changesTemplate } = changes || {};

        const getTemplatePerNode = (template: IComponentConfiguration) =>
            template && this.getNodes()?.map(() => template);

        return {
            currentValue: getTemplatePerNode(
                changesTemplate ? changesTemplate.currentValue : this.template
            ),
            previousValue: changesNodes
                ? this.template
                : getTemplatePerNode(
                      changesTemplate
                          ? changesTemplate.previousValue
                          : this.template
                  ),
        };
    }
}
