import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IPost, IPostUpdateInput } from "../types";

import * as queryOutputSnippets from "./query-output-snippets";

@Injectable()
export class PostService {
    constructor(private apollo: Apollo) {
    }

    public updatePost = (input: IPostUpdateInput): Observable<IPost> =>
        this.apollo.mutate({
            mutation: gql`
                mutation UpdatePost($input:PostUpdateInput!) {
                    updatePost(input:$input) {
                        ${queryOutputSnippets.postFields}
                    }
                }
            `,
            variables: {
                "input": input,
            },
        }).pipe(map((result) => result.data.updatePost))

}
