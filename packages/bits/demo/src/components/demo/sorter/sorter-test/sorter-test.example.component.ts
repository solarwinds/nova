import { Component, OnInit, ViewChild } from "@angular/core";
import { IMenuItem, ISorterChanges, SorterComponent, SorterDirection } from "@nova-ui/bits";
import _orderBy from "lodash/orderBy";
import { BehaviorSubject } from "rxjs";

interface IFilm {
    title: string;
    year: string;
    director: string;
}

@Component({
    selector: "nui-sorter-test-example",
    templateUrl: "./sorter-test.example.component.html",
    styleUrls: ["./sorter-test.example.component.less"],
})
export class SorterTestExampleComponent implements OnInit {
    private readonly emptyColumns: IMenuItem[] = [{
        title: $localize`Empty`,
        value: "",
    }];
    public readonly dataColumns: IMenuItem[] = [
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

    public columns: IMenuItem[] = this.dataColumns;

    @ViewChild(SorterComponent)
    private sorter: SorterComponent;

    private readonly showSubject = new BehaviorSubject(true);
    public readonly show$ = this.showSubject.asObservable();
    public sortDirection = SorterDirection.ascending;
    public sortBy = this.columns[0].value;
    public items: IFilm[] = getData();

    public ngOnInit() {
        this.sortItems(this.sortBy, this.sortDirection);
    }

    public updateSorterDirection() {
        const old = this.sortDirection;
        this.sortDirection = (old === SorterDirection.ascending) ?
            SorterDirection.descending : SorterDirection.ascending;
    }

    public onSorterAction(changeEvent: ISorterChanges) {
        this.sortBy = changeEvent.newValue.sortBy;
        this.sortItems(changeEvent.newValue.sortBy, changeEvent.newValue.direction);
    }

    private delayPromise(delay: number = 0): Promise<void> {
        return new Promise((resolve) => {
            setTimeout(resolve, delay);
        });
    }

    public async resetSorter() {
        this.showSubject.next(false);
        await this.delayPromise();
        this.columns = this.emptyColumns;
        this.sortBy = "";
        this.showSubject.next(true);
    }

    public updateSorterByProperty() {
        this.columns = this.dataColumns;
        this.sortBy = this.dataColumns[1].value;
    }

    public updateSorterByMethod() {
        this.columns = this.dataColumns;
        this.sorter.select(this.dataColumns[2]);
    }

    private sortItems(sortBy: string, direction: SorterDirection) {
        this.items = _orderBy(this.items, [sortBy], [direction as (SorterDirection.ascending | SorterDirection.descending)]) as IFilm[];
    }
}

function getData(): IFilm[] {
    return [
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
}
