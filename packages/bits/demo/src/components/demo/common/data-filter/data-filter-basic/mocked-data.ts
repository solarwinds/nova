import moment from "moment/moment";

export interface ListModel {
    issue: string;
    date: moment.Moment;
}

export interface TableModel extends ListModel {
    position: number;
}

export const LIST_DATA: ListModel[] = [
    {
        issue: "Issue 1",
        date: moment("01/02/2019", "MM/DD/YYYY"),
    },
    {
        issue: "Issue 2",
        date: moment("01/11/2019", "MM/DD/YYYY"),
    },
    {
        issue: "Issue 3",
        date: moment("02/12/2019", "MM/DD/YYYY"),
    },
    {
        issue: "Issue 4",
        date: moment("01/02/2019", "MM/DD/YYYY"),
    },
    {
        issue: "Issue 5",
        date: moment("02/10/2019", "MM/DD/YYYY"),
    },
];

export const TABLE_DATA: TableModel[] = [
    {
        position: 1,
        issue: "Issue 1",
        date: moment("01/02/2019", "MM/DD/YYYY"),
    },
    {
        position: 2,
        issue: "Issue 2",
        date: moment("01/11/2019", "MM/DD/YYYY"),
    },
    {
        position: 3,
        issue: "Issue 3",
        date: moment("02/12/2019", "MM/DD/YYYY"),
    },
    {
        position: 4,
        issue: "Issue 4",
        date: moment("01/02/2019", "MM/DD/YYYY"),
    },
    {
        position: 5,
        issue: "Issue 5",
        date: moment("02/10/2019", "MM/DD/YYYY"),
    },
];
