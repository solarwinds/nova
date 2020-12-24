import { ChangeDetectorRef, DoCheck, Input, OnChanges, OnDestroy, SimpleChanges } from "@angular/core";
import { LoggerService } from "@solarwinds/nova-bits";
import defaultsDeep from "lodash/defaultsDeep";
import { Subject } from "rxjs";

import { PizzagnaService } from "../../pizzagna/services/pizzagna.service";
import { IComponentConfiguration, IHasChangeDetector } from "../../types";

export abstract class BaseLayout implements IHasChangeDetector, OnChanges, DoCheck, OnDestroy {
    public nodeComponentsConfigs: IComponentConfiguration[];
    public nodeConfigs: IComponentConfiguration[];
    protected destroyed$: Subject<void> = new Subject<void>();

    @Input() public template: IComponentConfiguration;

    constructor(public changeDetector: ChangeDetectorRef,
        protected pizzagnaService: PizzagnaService,
        protected logger: LoggerService) {
    }

    public abstract getNodes(): string[];

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.nodes) {
            this.updateNodeConfigs();
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

    private updateNodeConfigs() {
        const nodes = this.getNodes();

        const nodesConfig = nodes && nodes.map(n => {
            const c = this.pizzagnaService.getComponent(n);
            if (typeof c === "undefined") {
                throw new Error("No component with id '" + n + "' was defined in the configuration.");
            }
            return c;
        });

        this.nodeComponentsConfigs = nodesConfig;
        this.nodeConfigs = nodesConfig?.map(v => defaultsDeep(v, this.template));
    }
}
