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

import { AfterViewInit, Component } from "@angular/core";
import _orderBy from "lodash/orderBy";

import { ISorterChanges, SorterDirection } from "@nova-ui/bits";

interface IFilm {
    title: string;
    year: string;
    director: string;
}

@Component({
    selector: "nui-sorter-legacy-string-input-usage-visual-test",
    templateUrl: "./sorter-legacy-string-input-usage-visual-test.component.html",
    styleUrls: [
        "./sorter-legacy-string-input-usage-visual-test.component.less",
    ],
    standalone: false
})
export class SorterLegacyStringInputUsageVisualTestComponent
    implements AfterViewInit
{
    public readonly columns = ["title", "year", "director"];
    public readonly initialSortDirection = SorterDirection.ascending;
    public sortBy = this.columns[1];

    public items: IFilm[] = [
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

    public ngAfterViewInit(): void {
        this.sortItems(this.sortBy, this.initialSortDirection);
    }

    onSorterAction(changeEvent: ISorterChanges): void {
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
