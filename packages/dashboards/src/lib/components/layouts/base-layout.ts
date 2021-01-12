import { ChangeDetectorRef, DoCheck, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { LoggerService } from "@nova-ui/bits";
import { Subject } from "rxjs";

import { IValueChange, mergeChanges } from "../../functions/merge-changes";
import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IComponentConfiguration, IHasChangeDetector } from "../../types";

export abstract class BaseLayout implements IHasChangeDetector, OnChanges, DoCheck, OnDestroy {
    // components config from 'pizza'
    public nodeComponentsConfigs: IComponentConfiguration[];
    // result config from merging 'nodeComponentsConfig' and parent 'template'
    public nodeConfigs: IComponentConfiguration[];

    protected destroyed$: Subject<void> = new Subject<void>();

    @Input() public template: Partial<IComponentConfiguration>;

    constructor(public changeDetector: ChangeDetectorRef,
                protected pizzagnaService: PizzagnaService,
                protected logger: LoggerService) {
    }

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
        }
    }

    public ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }

    public trackByFn(index: number, node: IComponentConfiguration) {
        return node.id;
    }

    private checkNodeConfigs(): boolean {
        const nodes = this.getNodes();

        if (!this.nodeComponentsConfigs || nodes.length !== this.nodeComponentsConfigs.length) {
            return true;
        }

        for (let i = 0; i < nodes.length; i++) {
            if (this.pizzagnaService.getComponent(nodes[i]) !== this.nodeComponentsConfigs[i]) {
                return true;
            }
        }

        return false;
    }

    private updateNodeComponentConfigs() {
        const nodes = this.getNodes();

        this.nodeComponentsConfigs = nodes && nodes.map(n => {
            const c = this.pizzagnaService.getComponent(n);
            if (typeof c === "undefined") {
                throw new Error("No component with id '" + n + "' was defined in the configuration.");
            }
            return c;
        });
    }

    private updateNodeConfigs(changes?: SimpleChanges) {
        this.nodeConfigs = mergeChanges(this.nodeConfigs,
            this.getTemplateChangeForNodes(changes),
            this.getNodeComponentsConfigs()
        );
    }

    private getNodeComponentsConfigs() {
        const nodeComponentsConfigsChanges: IValueChange = {
            currentValue: undefined,
            previousValue: this.nodeComponentsConfigs ? [...this.nodeComponentsConfigs] : undefined,
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
            currentValue: getTemplatePerNode(changesTemplate ? changesTemplate.currentValue : this.template),
            previousValue: changesNodes
                ? this.template
                : getTemplatePerNode(changesTemplate ? changesTemplate.previousValue : this.template),
        };
    }
}
