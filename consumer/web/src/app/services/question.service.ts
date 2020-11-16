
import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import cloneDeep from "lodash/cloneDeep";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IAddQuestionInput, IAnswerQuestionInput, IDeleteAnswerInput, IMarkAcceptedAnswerInput, IQuery,
    IQuestion, IQuestionsInput, IQuestionsPayload, IQuestionUpdateInput } from "../types";

import * as queryOutputSnippets from "./query-output-snippets";

@Injectable()
export class QuestionService {
    constructor(private apollo: Apollo) {
    }

    public getQuestions = (input: IQuestionsInput): Observable<IQuestionsPayload> =>
        this.apollo.query<IQuery>({
        query: gql`
            query Questions($input: QuestionsInput!) {
                questions(input: $input) {
                    total
                    questions {
                        ${queryOutputSnippets.partialQuestionFields}
                        answerPosts {
                            _id
                        }
                    }
                }
            }
            `,
            variables: {
                    "input": input,
            },
        }).pipe(map((result) => result.data.questions))

    public addQuestion = (question: IAddQuestionInput) =>
        this.apollo.mutate({
            mutation: gql`
                mutation AddQuestion($input: AddQuestionInput!) {
                    addQuestion(input: $input) {
                        _id
                    }
                }
            `,
            variables: {
                "input": question,
            },
        }).pipe(map((result) => result.data.addQuestion))

    public deleteQuestion = (id: string): Observable<boolean> =>
        this.apollo.mutate({
            mutation: gql`
                mutation DeleteQuestion($id: String!) {
                    deleteQuestion(id: $id)
                }
            `,
            variables: {
                "id": id,
            },
        }).pipe(map((result) => result.data.deleteQuestion))

    public getQuestion = (id: string): Observable<IQuestion> =>
        this.apollo.query<any>({
            query: gql`
                query Question($id: String!) {
                    question(id: $id) {
                        ${queryOutputSnippets.allQuestionFields}
                    }
                }
            `,
            variables: {
                "id": id,
            },
        }).pipe(map((result) => result.data.question))
            .pipe(map((question) => this.sortAnswers(question)))

    public updateQuestion = (question: IQuestionUpdateInput): Observable<IQuestion> =>
        this.apollo.mutate({
            mutation: gql`
                mutation UpdateQuestion($input:QuestionUpdateInput!) {
                    updateQuestion(input:$input) {
                        ${queryOutputSnippets.allQuestionFields}
                    }
                }
            `,
            variables: {
                "input": question,
            },
        }).pipe(map((result) => result.data.updateQuestion))
            .pipe(map((resultQuestion) => this.sortAnswers(resultQuestion)))

    public markAcceptedAnswer = (input: IMarkAcceptedAnswerInput): Observable<IQuestion> =>
        this.apollo.mutate({
            mutation: gql`
                mutation MarkAcceptedAnswer($input: MarkAcceptedAnswerInput!) {
                    markAcceptedAnswer(input:$input) {
                        ${queryOutputSnippets.allQuestionFields}
                    }
                }
            `,
            variables: {
                "input": input,
            },
        }).pipe(map((result) => result.data.markAcceptedAnswer))
            .pipe(map((question) => this.sortAnswers(question)))

    public answerQuestion = (answer: IAnswerQuestionInput): Observable<IQuestion> =>
        this.apollo.mutate({
            mutation: gql`
                mutation AnswerQuestion ($input: AnswerInput!) {
                    answerQuestion(input: $input) {
                        ${queryOutputSnippets.allQuestionFields}
                    }
                }
            `,
            variables: {
                "input": answer,
            },
        }).pipe(map((result) => result.data.answerQuestion))
            .pipe(map((question) => this.sortAnswers(question)))

    public deleteAnswer = (input: IDeleteAnswerInput): Observable<IQuestion> =>
        this.apollo.mutate({
            mutation: gql`
                mutation DeleteAnswer($input: DeleteAnswerInput!) {
                    deleteAnswer(input:$input) {
                        ${queryOutputSnippets.allQuestionFields}
                    }
                }
            `,
            variables: {
                "input": input,
            },
        }).pipe(map((result) => result.data.deleteAnswer))
            .pipe(map((question) => this.sortAnswers(question)))

    private sortAnswers(question: IQuestion): IQuestion {
        let acceptedAnswerPostArray = [];
        const index = question.answerPosts.map(p => p._id).indexOf(question.acceptedAnswerPostId);
        if (index !== -1) {
            const newQuestion = cloneDeep(question);
            acceptedAnswerPostArray = newQuestion.answerPosts.splice(index, 1);
            newQuestion.answerPosts = acceptedAnswerPostArray.concat(newQuestion.answerPosts);
            return newQuestion;
        }
        return question;
    }

}
