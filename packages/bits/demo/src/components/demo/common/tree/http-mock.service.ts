import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { delay } from "rxjs/operators";

interface FoodNode {
    name: string;
    page?: number;
    children?: FoodNode[];
    isLoading?: boolean;
    hasPagination?: boolean;
}

interface IApiResponse {
    items: FoodNode[];
    total: number;
}

@Injectable()
export class HttpMockService {
    private fruitsList = [
        $localize `apple`,
        $localize `orange`,
        $localize `banana`,
        $localize `watermelon`,
        $localize `peach`,
        $localize `pineapple`,
        $localize `lemon`,
        $localize `mango`,
    ];
    private vegetablesList = [
        $localize `tomato`,
        $localize `cucumber`,
        $localize `cabbage`,
        $localize `pepper`,
        $localize `carrot`,
        $localize `onion`,
        $localize `broccoli`,
        $localize `corn`,
    ];

    private totalItems = 1337;

    getNodeItems(nodeId: string, page: number, pageSize: number): Observable<IApiResponse> {
        // nodeId can be handled on API depending on app needs
        const itemList = nodeId === "Vegetables"
            ? this.vegetablesList
            : this.fruitsList;

        const items: FoodNode[] = Array.from({ length: pageSize }).map(() => ({
            name: this.getRandomFrom(itemList),
            page,
        }));

        const response = {
            items,
            total: this.totalItems,
        };
        return of(response).pipe(delay(1000));
    }

    private getRandomFrom(list: any[]) {
        return list[Math.floor(Math.random() * list.length)];
    }
}
