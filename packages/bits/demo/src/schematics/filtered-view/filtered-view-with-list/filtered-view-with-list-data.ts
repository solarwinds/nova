import { IServer, ServerStatus } from "./types";

// number of results to be displayed in the list
export const RESULTS_PER_PAGE = 20;

export const LOCAL_DATA: IServer[] = [
    {
        name: "FOCUS-SVR-12345",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-ASD123",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-DSA331",
        location: "Austin",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-JKS212",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "ABERN-SVR-ATQU9404",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-433AAD",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-098331",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-GHJ882",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-LLK001",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-KKJ998",
        location: "Kyiv",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-RRR001",
        location: "Brno",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-LKJF12",
        location: "Austin",
        status: ServerStatus.down,
    },
    {
        name: "Man-LT-882JJS",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-7733KK",
        location: "Brno",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-JSHNSA",
        location: "Austin",
        status: ServerStatus.active,
    },
    {
        name: "FOCUS-SVR-KKAEQWE",
        location: "Kyiv",
        status: ServerStatus.down,
    },
    {
        name: "FOCUS-SVR-123KKNPQ",
        location: "Brno",
        status: ServerStatus.active,
    },
    {
        name: "Man-LT-RRF231",
        location: "Austin",
        status: ServerStatus.down,
    },
];
