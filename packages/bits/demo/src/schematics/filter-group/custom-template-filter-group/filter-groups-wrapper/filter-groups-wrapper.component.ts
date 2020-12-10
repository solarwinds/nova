import { AfterViewInit, Component, ContentChildren, Inject, QueryList } from "@angular/core";
import { DataSourceService, IFilteringParticipants } from "@nova-ui/bits";
import _isEmpty from "lodash/isEmpty";

import { CustomTemplateFilterGroupCompositeComponent } from "../custom-template-filter-group.component";

@Component({
    selector: "app-custom-template-filter-groups-wrapper",
    templateUrl: "filter-groups-wrapper.component.html",
    styleUrls: ["filter-groups-wrapper.component.less"],
})

export class CustomTemplateFilterGroupsWrapperComponent implements AfterViewInit {
    @ContentChildren(CustomTemplateFilterGroupCompositeComponent) filterGroups: QueryList<CustomTemplateFilterGroupCompositeComponent>;

    public i18nHiddenFiltersMapping: { [k: string]: string } = {"=1": $localize `1 hidden filter.`, "other": $localize `# hidden filters.`};

    constructor(@Inject(DataSourceService) public dataSourceService: DataSourceService<any>) { }

    ngAfterViewInit() {
        this.dataSourceService.registerComponent(this.getFilterComponents());
        this.filterGroups.changes.subscribe(() => {
            this.dataSourceService.registerComponent(this.getFilterComponents());
        });
    }

    public emptyFilterGroupsTitles(): string {
        return this.filterGroups
            .filter(filterGroup => _isEmpty(filterGroup.filterGroupItem.allFilterOptions))
            .map(filterGroup => filterGroup.filterGroupItem.title)
            .join(", ");
    }

    public emptyFilterGroupsExist(): boolean {
        return this.emptyFilterGroupsCount() > 0;
    }

    public emptyFilterGroupsCount(): number {
        return this.filterGroups.filter(filterGroup => _isEmpty(filterGroup.filterGroupItem.allFilterOptions)).length;
    }

    private getFilterComponents(): IFilteringParticipants {
        return this.filterGroups.reduce((obj: IFilteringParticipants, item: CustomTemplateFilterGroupCompositeComponent) => {
            obj[item.filterGroupItem.id] = {componentInstance: item};
            return obj;
        }, {});
    }
}
