import { IWidget, PizzagnaLayer } from "@nova-ui/dashboards";
import { GridsterItem } from "angular-gridster2";

import { TestKpiDataSource, TestKpiDataSource2, TestKpiDataSourceBigNumber, TestKpiDataSourceSmallNumber } from "../../data/kpi-data-sources";

import { getKpiNode, getScaleBroker } from "./kpi-test-tiles";

export const positions: Record<string, GridsterItem> = {
    "widget0":   { "cols": 12, "rows": 2, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "widget1_1": { "cols": 6,  "rows": 3, "x": 0, "y": 0 },
    "widget1_2": { "cols": 6,  "rows": 3, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "fullWidth_1":   { "cols": 12, "rows": 4, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "widget3_1":   { "cols": 1,  "rows": 5, "x": 0, "y": 0 },
    "widget3_2": { "cols": 2,  "rows": 5, "x": 0, "y": 0 },
    "widget3_3": { "cols": 2,  "rows": 5, "x": 0, "y": 0 },
    "widget3_4": { "cols": 3,  "rows": 5, "x": 0, "y": 0 },
    "widget3_5": { "cols": 4,  "rows": 5, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "fullWidth_2":   { "cols": 12, "rows": 6, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "widget_4":   { "cols": 12, "rows": 8, "x": 0, "y": 0 },
    "widget_5":   { "cols": 12, "rows": 3, "x": 0, "y": 0 },
    // ----------------------------------------------------
    "fullWidth_3":   { "cols": 12, "rows": 2, "x": 0, "y": 0 },
    "fullWidth_4":   { "cols": 12, "rows": 12, "x": 0, "y": 0 },
};

export const widgets: IWidget[] = [
    {
        id: "widget0",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget0",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "green", ds: TestKpiDataSourceSmallNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget1_1",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget1_1",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget1_2",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget1_2",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "fullWidth_1",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "fullWidth",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [
                            "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5", "kpi6", "kpi7", "kpi8", "kpi9", "kpi10", "kpi11" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
                "kpi6": getKpiNode({ id: "kpi6", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi7": getKpiNode({ id: "kpi7", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi8": getKpiNode({ id: "kpi8", color: "teal", ds: TestKpiDataSource2}),
                "kpi9": getKpiNode({ id: "kpi9", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi10": getKpiNode({ id: "kpi10", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi11": getKpiNode({ id: "kpi11", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget3_1",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget3_1",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "green", ds: TestKpiDataSourceSmallNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget3_2",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget3_2",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "green", ds: TestKpiDataSourceSmallNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget3_3",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget3_3",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget3_4",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "3_4",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [
                            "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5", "kpi6", "kpi7", "kpi8", "kpi9", "kpi10", "kpi11" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
                "kpi6": getKpiNode({ id: "kpi6", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi7": getKpiNode({ id: "kpi7", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi8": getKpiNode({ id: "kpi8", color: "teal", ds: TestKpiDataSource2}),
                "kpi9": getKpiNode({ id: "kpi9", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi10": getKpiNode({ id: "kpi10", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi11": getKpiNode({ id: "kpi11", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget3_5",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget3_5",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "fullWidth_2",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "fullWidth_2",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [
                            "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5", "kpi6", "kpi7", "kpi8", "kpi9", "kpi10", "kpi11" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
                "kpi6": getKpiNode({ id: "kpi6", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi7": getKpiNode({ id: "kpi7", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi8": getKpiNode({ id: "kpi8", color: "teal", ds: TestKpiDataSource2}),
                "kpi9": getKpiNode({ id: "kpi9", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi10": getKpiNode({ id: "kpi10", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi11": getKpiNode({ id: "kpi11", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget_4",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget_4",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "widget_5",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "widget_5",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [ "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "fullWidth_3",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "fullWidth_3",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [
                            "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5", "kpi6", "kpi7", "kpi8", "kpi9", "kpi10", "kpi11" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
                "kpi6": getKpiNode({ id: "kpi6", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi7": getKpiNode({ id: "kpi7", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi8": getKpiNode({ id: "kpi8", color: "teal", ds: TestKpiDataSource2}),
                "kpi9": getKpiNode({ id: "kpi9", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi10": getKpiNode({ id: "kpi10", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi11": getKpiNode({ id: "kpi11", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
    {
        id: "fullWidth_4",
        type: "kpi",
        pizzagna: {
            [PizzagnaLayer.Configuration]: {
                "header": {
                    "properties": {
                        "title": "fullWidth_4",
                        "subtitle": "A bunch of number boxes",
                        "collapsible": true,
                    },
                },
                "tiles": {
                    providers: {
                        // ...getScaleBroker(),
                    },
                    "properties": {
                        "nodes": [
                            "kpi0", "kpi1", "kpi2", "kpi3", "kpi4", "kpi5", "kpi6", "kpi7", "kpi8", "kpi9", "kpi10", "kpi11" ],
                    },
                },
                "kpi0": getKpiNode({ id: "kpi0", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi1": getKpiNode({ id: "kpi1", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi2": getKpiNode({ id: "kpi2", color: "teal", ds: TestKpiDataSource2}),
                "kpi3": getKpiNode({ id: "kpi3", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi4": getKpiNode({ id: "kpi4", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi5": getKpiNode({ id: "kpi5", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
                "kpi6": getKpiNode({ id: "kpi6", formatter: true, color: "pink", ds: TestKpiDataSourceBigNumber}),
                "kpi7": getKpiNode({ id: "kpi7", color: "lightgrey", ds: TestKpiDataSource2}),
                "kpi8": getKpiNode({ id: "kpi8", color: "teal", ds: TestKpiDataSource2}),
                "kpi9": getKpiNode({ id: "kpi9", formatter: true, ds: TestKpiDataSourceSmallNumber}),
                "kpi10": getKpiNode({ id: "kpi10", color: "orange", ds: TestKpiDataSourceSmallNumber}),
                "kpi11": getKpiNode({ id: "kpi11", color: "antiquewhite", ds: TestKpiDataSourceBigNumber}),
            },
        },
    },
];
