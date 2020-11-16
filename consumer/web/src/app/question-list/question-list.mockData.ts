import { IPost, IVote } from "../types";

export const mockData = {
    testQuestions: [
        {
            "_id": "1",
            "title": "Trying to use nova and on old pages with legacy nui",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "1",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `In LEM we are trying to use nova and on old pages leave nui. Currently we are having hybrid
                    angularjs/angular5 app, but we are having issues with styles colliding between nova and nui.
                    Is there any workaroud? Why nova is using nui- prefix instead of nova?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": [
                {
                    "_id": "16",
                    "votes": 0,
                    "text": "text",
                    "author": "test author",
                    "creationDate": new Date(1997, 7, 16, 19, 20, 30, 123),
                    "lastUpdatedDate": new Date(1998, 7, 16, 19, 20, 30, 123),
                },
            ],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "2",
            "title": "Using a single TextBox control to dynamically handle either text or numeric data",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "2",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `What is the best approach for using a single TextBox control to dynamically handle either text or
                    numeric data and include numeric validation?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "3",
            "title": "Getting multi-byte characters like Japanese to display",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "3",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `Is there anything special that needs to be done in Nova to get multi-byte characters like
                    Japanese to display?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "4",
            "title": "Trying to use nova and on old pages with legacy nui",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "4",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `In LEM we are trying to use nova and on old pages leave nui. Currently we are having hybrid
                    angularjs/angular5 app, but we are having issues with styles colliding between nova and nui.
                    Is there any workaroud? Why nova is using nui- prefix instead of nova?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "5",
            "title": "Using a single TextBox control to dynamically handle either text or numeric data",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "5",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `What is the best approach for using a single TextBox control to dynamically handle either text or
                    numeric data and include numeric validation?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "6",
            "title": "Getting multi-byte characters like Japanese to display",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "6",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `Is there anything special that needs to be done in Nova to get multi-byte characters like
                    Japanese to display?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "7",
            "title": "Trying to use nova and on old pages with legacy nui",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "7",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `In LEM we are trying to use nova and on old pages leave nui. Currently we are having hybrid
                    angularjs/angular5 app, but we are having issues with styles colliding between nova and nui.
                    Is there any workaroud? Why nova is using nui- prefix instead of nova?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "8",
            "title": "Using a single TextBox control to dynamically handle either text or numeric data",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "8",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `What is the best approach for using a single TextBox control to dynamically handle either text or
                    numeric data and include numeric validation?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "9",
            "title": "Getting multi-byte characters like Japanese to display",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "9",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `Is there anything special that needs to be done in Nova to get multi-byte characters like
                    Japanese to display?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "10",
            "title": "Trying to use nova and on old pages with legacy nui",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "10",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `In LEM we are trying to use nova and on old pages leave nui. Currently we are having hybrid
                    angularjs/angular5 app, but we are having issues with styles colliding between nova and nui.
                    Is there any workaroud? Why nova is using nui- prefix instead of nova?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "11",
            "title": "Using a single TextBox control to dynamically handle either text or numeric data",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "11",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `What is the best approach for using a single TextBox control to dynamically handle either text or
                    numeric data and include numeric validation?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "12",
            "title": "Getting multi-byte characters like Japanese to display",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "12",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `Is there anything special that needs to be done in Nova to get multi-byte characters like
                    Japanese to display?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "13",
            "title": "Trying to use nova and on old pages with legacy nui",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "13",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `In LEM we are trying to use nova and on old pages leave nui. Currently we are having hybrid
                    angularjs/angular5 app, but we are having issues with styles colliding between nova and nui.
                    Is there any workaroud? Why nova is using nui- prefix instead of nova?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "14",
            "title": "Using a single TextBox control to dynamically handle either text or numeric data",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "14",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `What is the best approach for using a single TextBox control to dynamically handle either text or
                    numeric data and include numeric validation?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
        {
            "_id": "15",
            "title": "Getting multi-byte characters like Japanese to display",
            "acceptedAnswerPostId": "",
            "questionPost": {
                "_id": "15",
                "creationDate": new Date("2018-04-11"),
                "lastUpdatedDate": new Date("2018-04-11"),
                "author": "Nova Consumer",
                "votes": 0,
                "text": `Is there anything special that needs to be done in Nova to get multi-byte characters like
                    Japanese to display?`,
            },
            "tags": ["nova", "nui", "angular", "aot"],
            "answerPosts": <IPost[]>[],
            "userVotes": <IVote[]>[],
        },
    ],
};
