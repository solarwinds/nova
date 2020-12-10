import { AfterViewInit, Inject } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { EventBus, IEvent } from "@nova-ui/bits";
import { immutableSet } from "@nova-ui/bits";
import difference from "lodash/difference";
import keyBy from "lodash/keyBy";
import omit from "lodash/omit";
import { takeUntil } from "rxjs/operators";

import { PizzagnaService } from "../../../../pizzagna/services/pizzagna.service";
import { NOVA_KPI_COLOR_PRIORITIZER, NOVA_KPI_DATASOURCE_ADAPTER } from "../../../../services/types";
import { IComponentConfiguration, PIZZAGNA_EVENT_BUS, PizzagnaLayer } from "../../../../types";
import { IItemConfiguration } from "../../../components/types";
import { IKpiItemConfiguration } from "../../../components/widgets/kpi/types";
import { PreviewService } from "../../preview.service";
import { BaseConverter } from "../base-converter";

export class KpiTilesConverterService extends BaseConverter implements AfterViewInit {
    private shouldReadForm = false;

    constructor(@Inject(PIZZAGNA_EVENT_BUS) eventBus: EventBus<IEvent>,
                previewService: PreviewService,
                pizzagnaService: PizzagnaService) {
        super(eventBus, previewService, pizzagnaService);
    }

    ngAfterViewInit(): void {
        super.ngAfterViewInit();
    }

    public buildForm(): void {
        const preview = this.getPreview();
        const tiles: IKpiItemConfiguration[] = preview?.tiles?.properties?.nodes?.map((id: string) => ({
                id,
                componentType: preview[id].componentType,
            } as IKpiItemConfiguration)) || [] ;
        const tileIds = tiles?.map(tile => tile.id);

        this.pizzagnaService.createComponentsFromTemplate("tiles", tileIds);
        let updatedPizzagna = this.pizzagnaService.pizzagna;

        updatedPizzagna = immutableSet(updatedPizzagna, `${PizzagnaLayer.Data}.tiles.properties.tiles`, tiles);

        setTimeout(() => this.shouldReadForm = true);
        this.updateFormPizzagna(updatedPizzagna);
    }

    public toPreview(form: FormGroup): void {
        form.get("tiles")?.valueChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe(kpiTiles => {
                if (!this.shouldReadForm) {
                    return;
                }
                let preview = this.getPreview();
                const tileIds = ((kpiTiles) || []).map((t: IItemConfiguration) => t.id);
                const idDifference: string[] = difference(preview?.tiles?.properties?.nodes, tileIds);
                if (idDifference.length) {
                    preview = omit(preview, idDifference);
                }
                const tilesIndex = keyBy(kpiTiles, (t) => t.id); // this helps us to access the actual tile forms
                preview = immutableSet(preview, "tiles.properties.nodes", tileIds);

                for (const tileId of tileIds) {
                    const tile = tilesIndex[tileId];
                    if (!tile) {
                        // tile might not have been created yet
                        continue;
                    }

                    if (!preview[tile.id]) {
                        const value: IComponentConfiguration = this.getTileConfiguration(tile.id, tile.componentType);
                        preview = immutableSet(preview, tile.id, value);
                    }
                }
                this.updatePreview(preview);
            });
    }

    protected getTileConfiguration(id: string, componentType: string): IComponentConfiguration {
        return {
            id: id,
            // componentType: componentType,
            providers: {
                dataSource: {
                    // @ts-ignore: The expected type comes from property 'providerId'
                    // which is declared here on type 'IProviderConfiguration'
                    providerId: undefined,
                },
                adapter: {
                    providerId: NOVA_KPI_DATASOURCE_ADAPTER,
                    properties: {
                        componentId: id,
                        propertyPath: "widgetData",
                    },
                },
                kpiColorPrioritizer: {
                    providerId: NOVA_KPI_COLOR_PRIORITIZER,
                    properties: {},
                },
            },
        };
    }
}
