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
        $localize`apple`,
        $localize`orange`,
        $localize`banana`,
        $localize`watermelon`,
        $localize`peach`,
        $localize`pineapple`,
        $localize`lemon`,
        $localize`mango`,
    ];
    private vegetablesList = [
        $localize`tomato`,
        $localize`cucumber`,
        $localize`cabbage`,
        $localize`pepper`,
        $localize`carrot`,
        $localize`onion`,
        $localize`broccoli`,
        $localize`corn`,
    ];

    private totalItems = 1337;

    getNodeItems(
        nodeId: string,
        page: number,
        pageSize: number
    ): Observable<IApiResponse> {
        // nodeId can be handled on API depending on app needs
        const itemList =
            nodeId === "Vegetables" ? this.vegetablesList : this.fruitsList;

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
