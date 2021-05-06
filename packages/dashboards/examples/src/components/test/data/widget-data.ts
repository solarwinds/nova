import { CHART_PALETTE_CS_S } from "@nova-ui/charts";
import { ITimeseriesWidgetData, ITimeseriesWidgetStatusData } from "@nova-ui/dashboards";
import moment from "moment/moment";

export interface BasicTableModel {
    position: number;
    name: string;
    features: any;
    status: string;
    checks: any;
    "cpu-load": number;
    firstUrl: string;
    firstUrlLabel: string;
    secondUrl: string;
    secondUrlLabel: string;
}

export interface IProportionalWidgetData {
    id: string;
    name: string;
    data: number[];
    icon: string;
    link: string;
    value: string;
}

export const PROPORTIONAL_WIDGET_DATA_SMALL: IProportionalWidgetData[] = [
    {
        id: "Down",
        name: "Down",
        data: [1],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/London",
        value: "London",
    },
    {
        id: "Critically long tick name",
        name: "Critically long tick name",
        data: [2],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Paris",
        value: "Paris",
    },
    {
        id: "Warning",
        name: "Warning",
        data: [3],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Rio_de_Janeiro",
        value: "Rio",
    },
];

export const PROPORTIONAL_WIDGET_DATA_MEDIUM: IProportionalWidgetData[] = [
    {
        id: "Down",
        name: "Down",
        data: [1],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/Brno",
        value: "Brno",
    },
    {
        id: "Critical",
        name: "Critical",
        data: [1],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Kyiv",
        value: "Kyiv",
    },
    {
        id: "Warning",
        name: "Warning",
        data: [2],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Austin",
        value: "Austin",
    },
    {
        id: "Unknown",
        name: "Unknown",
        data: [3],
        icon: "status_unknown",
        link: "https://en.wikipedia.org/wiki/Lisbon",
        value: "Lisbon",
    },
    {
        id: "Up",
        name: "Up",
        data: [5],
        icon: "status_up",
        link: "https://en.wikipedia.org/wiki/Sydney",
        value: "Sydney",
    },
    {
        id: "Unmanaged",
        name: "Unmanaged",
        data: [8],
        icon: "status_unmanaged",
        link: "https://en.wikipedia.org/wiki/Nur-Sultan",
        value: "Nur-Sultan",
    },
];

export const PROPORTIONAL_WIDGET_DATA_LARGE: IProportionalWidgetData[] = [
    {
        id: "Down",
        name: "Down",
        data: [34000],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/Brno",
        value: "Brno",
    },
    {
        id: "Critical",
        name: "Critical",
        data: [34000],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Kyiv",
        value: "Kyiv",
    },
    {
        id: "Warning",
        name: "Warning",
        data: [34000],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Austin",
        value: "Austin",
    },
    {
        id: "Unknown",
        name: "Unknown",
        data: [34000],
        icon: "status_unknown",
        link: "https://en.wikipedia.org/wiki/Lisbon",
        value: "Lisbon",
    },
    {
        id: "Up",
        name: "Up",
        data: [34000],
        icon: "status_up",
        link: "https://en.wikipedia.org/wiki/Sydney",
        value: "Sydney",
    },
    {
        id: "Unmanaged",
        name: "Unmanaged",
        data: [34000],
        icon: "status_unmanaged",
        link: "https://en.wikipedia.org/wiki/Nur-Sultan",
        value: "Nur-Sultan",
    },
    {
        id: "Down2",
        name: "Down2",
        data: [34000],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/Brno",
        value: "Brno",
    },
    {
        id: "Critical2",
        name: "Critical2",
        data: [34000],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Kyiv",
        value: "Kyiv",
    },
    {
        id: "Warning2",
        name: "Warning2",
        data: [34000],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Austin",
        value: "Austin",
    },
    {
        id: "Unknown2",
        name: "Unknown2",
        data: [55000],
        icon: "status_unknown",
        link: "https://en.wikipedia.org/wiki/Lisbon",
        value: "Lisbon",
    },
    {
        id: "Up2",
        name: "Up2",
        data: [89000],
        icon: "status_up",
        link: "https://en.wikipedia.org/wiki/Sydney",
        value: "Sydney",
    },
    {
        id: "Unmanaged2",
        name: "Unmanaged2",
        data: [144000],
        icon: "status_unmanaged",
        link: "https://en.wikipedia.org/wiki/Nur-Sultan",
        value: "Nur-Sultan",
    },
    {
        id: "Down3",
        name: "Down3",
        data: [233000],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/Brno",
        value: "Brno",
    },
    {
        id: "Critical3",
        name: "Critical3",
        data: [377000],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Kyiv",
        value: "Kyiv",
    },
    {
        id: "Warning3",
        name: "Warning3",
        data: [610000],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Austin",
        value: "Austin",
    },
    {
        id: "Unknown3",
        name: "Unknown3",
        data: [987000],
        icon: "status_unknown",
        link: "https://en.wikipedia.org/wiki/Lisbon",
        value: "Lisbon",
    },
    {
        id: "Up3",
        name: "Up3",
        data: [1597000],
        icon: "status_up",
        link: "https://en.wikipedia.org/wiki/Sydney",
        value: "Sydney",
    },
];

export const PROPORTIONAL_WIDGET_DATA_BIG_NUMBERS: IProportionalWidgetData[] = [
    {
        id: "Down",
        name: "Down",
        data: [159],
        icon: "status_down",
        link: "https://en.wikipedia.org/wiki/Brno",
        value: "Brno",
    },
    {
        id: "Critical",
        name: "Critical",
        data: [1290],
        icon: "status_critical",
        link: "https://en.wikipedia.org/wiki/Kyiv",
        value: "Kyiv",
    },
    {
        id: "Warning",
        name: "Warning",
        data: [1569],
        icon: "status_warning",
        link: "https://en.wikipedia.org/wiki/Austin",
        value: "Austin",
    },
    {
        id: "Unknown",
        name: "Unknown",
        data: [14567],
        icon: "status_unknown",
        link: "https://en.wikipedia.org/wiki/Lisbon",
        value: "Lisbon",
    },
    {
        id: "Up",
        name: "Up",
        data: [123456],
        icon: "status_up",
        link: "https://en.wikipedia.org/wiki/Sydney",
        value: "Sydney",
    },
    {
        id: "Unmanaged",
        name: "Unmanaged",
        data: [1548585],
        icon: "status_unmanaged",
        link: "https://en.wikipedia.org/wiki/Nur-Sultan",
        value: "Nur-Sultan",
    },
];

export const frozenTime = () => moment([2020, 1, 6, 15, 0, 0]).startOf("day");

export const getTimeseriesWidgetData = () => (
    [
        {
            id: "series-1",
            description: "test1111.demo.lab",
            link: "https://en.wikipedia.org/wiki/Nur-Sultan",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 34 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 33 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 35 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 36 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 34 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 33 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 32 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 31 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 30 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 30 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 30 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 35 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 33 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 40 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 35 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 30 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 35 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 30 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 35 },
            ],
        },
        {
            id: "series-2",
            description: "test2222.demo.lab",
            secondaryLink: "https://en.wikipedia.org/wiki",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 64 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 55 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 55 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 45 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 35 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 61 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 58 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 64 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 61 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 62 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 64 },
            ],
        },
        {
            id: "series-3",
            description: "test3333.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 64 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 95 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 90 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 75 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 69 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 75 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 81 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 93 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 83 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 74 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 69 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 71 },
            ],
        },
        {
            id: "series-4",
            description: "test4444.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 72 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 54 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 94 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 123 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 75 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 74 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 78 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 75 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 95 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 79 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 82 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 82 },
            ],
        },
    ]
);

export const getTimeseriesWidgetData2 = () => (
    [
        {
            id: "series-a",
            description: "lastchance.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 10 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 13 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 20 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 10 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 5 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 10 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 14 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 13 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 15 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 16 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 14 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 13 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 10 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 12 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 11 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 14 },
            ],
        },
        {
            id: "series-b",
            description: "newhope.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 84 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 75 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 95 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 81 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 85 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 83 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 88 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 84 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 83 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 80 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 82 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 81 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 82 },
            ],
        },
        {
            id: "series-c",
            description: "empire.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 66 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 70 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 69 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 65 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 61 },
                { x: frozenTime().subtract(9, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(8, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(7, "day").toDate(), y: 60 },
                { x: frozenTime().subtract(6, "day").toDate(), y: 64 },
                { x: frozenTime().subtract(5, "day").toDate(), y: 63 },
                { x: frozenTime().subtract(4, "day").toDate(), y: 68 },
                { x: frozenTime().subtract(3, "day").toDate(), y: 62 },
                { x: frozenTime().subtract(2, "day").toDate(), y: 61 },
                { x: frozenTime().subtract(1, "day").toDate(), y: 69 },
            ],
        },
    ]
);

export const getTimeseriesEventsData = () => (
    [
        {
            id: "series-a",
            description: "lastchance.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 9049 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 9089 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 9149 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 9189 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 9249 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 9289 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 9349 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 9389  },
                { x: frozenTime().subtract(12, "day").toDate(), y: 9449 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 9489 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 9549 },
                { x: frozenTime().subtract(9, "day").toDate(), y:  9589 },
                { x: frozenTime().subtract(8, "day").toDate(), y:  9649 },
                { x: frozenTime().subtract(7, "day").toDate(), y:  9689 },
                { x: frozenTime().subtract(6, "day").toDate(), y:  9749 },
                { x: frozenTime().subtract(5, "day").toDate(), y:  9789 },
                { x: frozenTime().subtract(4, "day").toDate(), y:  9849 },
                { x: frozenTime().subtract(3, "day").toDate(), y:  9889 },
                { x: frozenTime().subtract(2, "day").toDate(), y:  9949 },
                { x: frozenTime().subtract(1, "day").toDate(), y:  10100 },
            ],
        },
        {
            id: "series-b",
            description: "newhope.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 904900 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 908900 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 914900 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 918900 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 924900 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 928900 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 934900 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 938900 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 944900 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 948900 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 954900 },
                { x: frozenTime().subtract(9, "day").toDate(), y:  958900 },
                { x: frozenTime().subtract(8, "day").toDate(), y:  964900 },
                { x: frozenTime().subtract(7, "day").toDate(), y:  968900 },
                { x: frozenTime().subtract(6, "day").toDate(), y:  974900 },
                { x: frozenTime().subtract(5, "day").toDate(), y:  978900 },
                { x: frozenTime().subtract(4, "day").toDate(), y:  984900 },
                { x: frozenTime().subtract(3, "day").toDate(), y:  988900 },
                { x: frozenTime().subtract(2, "day").toDate(), y:  994900 },
                { x: frozenTime().subtract(1, "day").toDate(), y:  998900 },
            ],
        },
        {
            id: "series-c",
            description: "empire.demo.lab",
            data: [
                { x: frozenTime().subtract(20, "day").toDate(), y: 904900000 },
                { x: frozenTime().subtract(19, "day").toDate(), y: 908900000 },
                { x: frozenTime().subtract(18, "day").toDate(), y: 914900000 },
                { x: frozenTime().subtract(17, "day").toDate(), y: 918900000 },
                { x: frozenTime().subtract(16, "day").toDate(), y: 924900000 },
                { x: frozenTime().subtract(15, "day").toDate(), y: 928900000 },
                { x: frozenTime().subtract(14, "day").toDate(), y: 934900000 },
                { x: frozenTime().subtract(13, "day").toDate(), y: 938900000 },
                { x: frozenTime().subtract(12, "day").toDate(), y: 944900000 },
                { x: frozenTime().subtract(11, "day").toDate(), y: 948900000 },
                { x: frozenTime().subtract(10, "day").toDate(), y: 954900000 },
                { x: frozenTime().subtract(9, "day").toDate(), y:  958900000 },
                { x: frozenTime().subtract(8, "day").toDate(), y:  964900000 },
                { x: frozenTime().subtract(7, "day").toDate(), y:  968900000 },
                { x: frozenTime().subtract(6, "day").toDate(), y:  974900000 },
                { x: frozenTime().subtract(5, "day").toDate(), y:  978900000 },
                { x: frozenTime().subtract(4, "day").toDate(), y:  984900000 },
                { x: frozenTime().subtract(3, "day").toDate(), y:  988900000 },
                { x: frozenTime().subtract(2, "day").toDate(), y:  994900000 },
                { x: frozenTime().subtract(1, "day").toDate(), y:  998900000 },
            ],
        },
    ]
);

enum Status {
    Unknown = "unknown",
    Up = "up",
    Warning = "warning",
    Down = "down",
    Critical = "critical",
}

const statusColors: Record<Status, string> = {
    [Status.Unknown]: CHART_PALETTE_CS_S[3],
    [Status.Up]: CHART_PALETTE_CS_S[4],
    [Status.Warning]: CHART_PALETTE_CS_S[2],
    [Status.Down]: CHART_PALETTE_CS_S[0],
    [Status.Critical]: CHART_PALETTE_CS_S[1],
};

export function getTimeseriesStatusData(): ITimeseriesWidgetData<ITimeseriesWidgetStatusData>[] {
    const series: ITimeseriesWidgetData<any>[] = [
        {
            id: "series-1",
            description: "lastchance.demo.lab",
            data: [
                { x: frozenTime().subtract(30, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(28, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(27, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(26, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(25, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(24, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(23, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(19, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(17, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(16, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(14, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(13, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(10, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(9 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(8 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(6 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(5 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(4 , "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(2 , "day").toDate(), y: Status.Up },
                { x: frozenTime().toDate(), y: Status.Up },
            ],
        },
        {
            id: "series-2",
            description: "newhope.demo.lab",
            data: [
                { x: frozenTime().subtract(30, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(28, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(27, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(26, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(25, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(24, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(23, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(19, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(17, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(16, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(14, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(12, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(10, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(9 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(7 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(6 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(5 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(3 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(2 , "day").toDate(), y: Status.Warning },
                { x: frozenTime().toDate(), y: Status.Warning },
            ],
        },
    ];

    for (const s of series) {
        s.data = s.data.map((d: any, i: number) => ({
            ...d,
            color: statusColors[d.y as Status],
            thick: d.y !== Status.Up,
            icon: "status_" + d.y,
        }));
    }

    return series;
}

export function getTimeseriesStatusIntervalData(): ITimeseriesWidgetData<ITimeseriesWidgetStatusData>[] {
    const series: ITimeseriesWidgetData<any>[] = [
        {
            id: "series-1",
            description: "lastchance.demo.lab",
            data: [
                { x: frozenTime().subtract(19, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(18, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(17, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(16, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(15, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(14, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(13, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(12, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(11, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(10, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(9 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(8 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(7 , "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(6 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(5 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(4 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(3 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(2 , "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(1 , "day").toDate(), y: Status.Up },
                { x: frozenTime().toDate(), y: Status.Up },
            ],
        },
        {
            id: "series-2",
            description: "newhope.demo.lab",
            data: [
                { x: frozenTime().subtract(19, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(18, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(17, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(16, "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(15, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(14, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(13, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(12, "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(11, "day").toDate(), y: Status.Warning },
                { x: frozenTime().subtract(10, "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(9 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(8 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(7 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(6 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(5 , "day").toDate(), y: Status.Down },
                { x: frozenTime().subtract(4 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(3 , "day").toDate(), y: Status.Critical },
                { x: frozenTime().subtract(2 , "day").toDate(), y: Status.Up },
                { x: frozenTime().subtract(1 , "day").toDate(), y: Status.Warning },
                { x: frozenTime().toDate(), y: Status.Warning },
            ],
        },
    ];

    for (const s of series) {
        s.data = s.data.map((d: any, i: number) => ({
            ...d,
            color: statusColors[d.y as Status],
            thick: d.y !== Status.Up,
            icon: "status_" + d.y,
        }));
    }

    return series;
}
