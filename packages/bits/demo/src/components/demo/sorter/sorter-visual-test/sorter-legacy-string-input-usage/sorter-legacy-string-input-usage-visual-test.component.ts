import { AfterViewInit, Component } from "@angular/core";
import { ISorterChanges, SorterDirection } from "@solarwinds/nova-bits";
import _orderBy from "lodash/orderBy";

interface IFilm {
    title: string;
    year: string;
    director: string;
}

@Component({
    selector: "nui-sorter-legacy-string-input-usage-visual-test",
    templateUrl: "./sorter-legacy-string-input-usage-visual-test.component.html",
    styleUrls: ["./sorter-legacy-string-input-usage-visual-test.component.less"],
})
export class SorterLegacyStringInputUsageVisualTestComponent implements AfterViewInit {
    public readonly columns = ["title", "year", "director"];
    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.columns[1];

    public items: IFilm[] = [
        { title: "Vertigo", year: "1958", director: "Alfred Hitchcock" },
        { title: "Citizen Kane", year: "1941", director: "Orson Welles" },
        { title: "2001: A Space Odyssey", year: "1968", director: "Stanley Kubrick" },
        { title: "The Godfather", year: "1972", director: "Francis Ford Coppola" },
        { title: "Mulholland Dr.", year: "2001", director: "David Lynch" },
        { title: "Taxi Driver", year: "1976", director: "Martin Scorsese" },
        { title: "La Dolce Vita", year: "1960", director: "Federico Fellini" },
        { title: "The Silence of the Lambs", year: "1991", director: "Jonathan Demme" },
        { title: "The Terminator", year: "1984", director: "James Cameron" },
    ];

    ngAfterViewInit() {
        this.sortItems(this.sortBy, this.initialSortDirection);
    }

    onSorterAction(changeEvent: ISorterChanges) {
        this.sortBy = changeEvent.newValue.sortBy;
        this.sortItems(changeEvent.newValue.sortBy, changeEvent.newValue.direction);
    }

    private sortItems(sortBy: string, direction: SorterDirection) {
        this.items = _orderBy(this.items, [sortBy],
            [direction as (SorterDirection.ascending | SorterDirection.descending)]) as IFilm[];
    }
}
