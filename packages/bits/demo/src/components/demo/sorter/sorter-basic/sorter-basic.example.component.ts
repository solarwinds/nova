import { Component, OnInit } from "@angular/core";
import _orderBy from "lodash/orderBy";

import { IMenuItem, ISorterChanges, SorterDirection } from "@nova-ui/bits";

interface IFilm {
    title: string;
    year: string;
    director: string;
}

@Component({
    selector: "nui-sorter-basic-example",
    templateUrl: "./sorter-basic.example.component.html",
    styleUrls: ["./sorter-basic.example.component.less"],
})
export class SorterBasicExampleComponent implements OnInit {
    public readonly columns: IMenuItem[] = [
        {
            title: $localize`Title`,
            value: "title",
        },
        {
            title: $localize`Year`,
            value: "year",
        },
        {
            title: $localize`Director`,
            value: "director",
        },
    ];

    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.columns[1].value;
    public items: IFilm[] = getData();

    public ngOnInit() {
        this.sortItems(this.sortBy, this.initialSortDirection);
    }

    public onSorterAction(changeEvent: ISorterChanges) {
        this.sortBy = changeEvent.newValue.sortBy;
        this.sortItems(
            changeEvent.newValue.sortBy,
            changeEvent.newValue.direction
        );
    }

    private sortItems(sortBy: string, direction: SorterDirection) {
        this.items = _orderBy(
            this.items,
            [sortBy],
            [
                direction as
                    | SorterDirection.ascending
                    | SorterDirection.descending,
            ]
        ) as IFilm[];
    }
}

function getData(): IFilm[] {
    return [
        { title: "Vertigo", year: "1958", director: "Alfred Hitchcock" },
        { title: "Citizen Kane", year: "1941", director: "Orson Welles" },
        {
            title: "2001: A Space Odyssey",
            year: "1968",
            director: "Stanley Kubrick",
        },
        {
            title: "The Godfather",
            year: "1972",
            director: "Francis Ford Coppola",
        },
        { title: "Mulholland Dr.", year: "2001", director: "David Lynch" },
        { title: "Taxi Driver", year: "1976", director: "Martin Scorsese" },
        { title: "La Dolce Vita", year: "1960", director: "Federico Fellini" },
        {
            title: "The Silence of the Lambs",
            year: "1991",
            director: "Jonathan Demme",
        },
        { title: "The Terminator", year: "1984", director: "James Cameron" },
    ];
}
