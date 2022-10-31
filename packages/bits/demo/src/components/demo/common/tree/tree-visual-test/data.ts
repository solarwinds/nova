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

export interface FoodNode {
    name: string;
    page?: number;
    children?: FoodNode[];
    isLoading?: boolean;
    hasPagination?: boolean;
}

export interface IApiResponse {
    items: FoodNode[];
    total: number;
}

@Injectable()
export class HttpMock {
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

        const totalItemList = this.getTotalItemList(
            itemList,
            this.totalItems / itemList.length
        );

        const items: FoodNode[] = Array.from({ length: pageSize }).map(
            (i, ind) => ({
                name: totalItemList[ind],
                page,
            })
        );

        const response = {
            items,
            total: this.totalItems,
        };
        return of(response).pipe(delay(1000));
    }

    private getTotalItemList(list: any[], times: number) {
        const totalArray = [];
        for (let i = 0; i < times; i++) {
            totalArray.push(...list);
        }
        return totalArray;
    }
}

export const TREE_DATA_PAGINATOR: FoodNode[] = [
    {
        name: "Food",
        children: [
            {
                name: "Vegetables",
                children: [],
                hasPagination: true,
            },
            {
                name: "Fruits",
                children: [],
                hasPagination: true,
            },
        ],
    },
];

export const TREE_DATA: FoodNode[] = [
    {
        name: "Fruit",
        children: [
            { name: "Apple" },
            { name: "Banana" },
            { name: "Fruit loops" },
        ],
    },
    {
        name: "Vegetables",
        children: [
            {
                name: "Green",
                children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
            },
            {
                name: "Orange",
                children: [{ name: "Pumpkins" }, { name: "Carrots" }],
            },
            {
                name: "Red",
            },
        ],
    },
    {
        name: "Meat",
    },
];

export const TREE_DATA_CHECKBOX: FoodNode[] = [
    {
        name: "Vegetables",
        children: [
            {
                name: "Green",
                children: [{ name: "Broccoli" }, { name: "Brussels sprouts" }],
            },
            {
                name: "Orange",
                children: [{ name: "Pumpkins" }, { name: "Carrots" }],
            },
            {
                name: "Red",
            },
        ],
    },
    {
        name: "Fruit",
        children: [
            { name: "Apple" },
            { name: "Banana" },
            { name: "Fruit loops" },
        ],
    },
    {
        name: "Meat",
    },
];
