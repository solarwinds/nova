import { Injectable } from "@angular/core";
import { Apollo } from "apollo-angular";
import gql from "graphql-tag";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

import { IRegisterVoteInput, IVote } from "../types";


@Injectable()
export class VoteService {
    constructor(private apollo: Apollo) {
    }

    public registerVote = (input: IRegisterVoteInput): Observable<IVote> =>
        this.apollo.mutate({
            mutation: gql`
                mutation RegisterVote($input: RegisterVoteInput!) {
                    registerVote(input: $input) {
                        postId
                        vote
                    }
                }
            `,
            variables: {
                "input": input,
            },
        }).pipe(map((result) => result.data.registerVote))

    public getUserVotes = (userId: string): Observable<IVote[]> =>
        this.apollo.query<any>({
            query: gql`
                query UserVotes($userId: String!) {
                    userVotes(userId: $userId) {
                        postId
                        vote
                    }
                }
            `,
            variables: {
                "userId": userId,
            },
        }).pipe(map((result) => result.data.userVotes))
        
}
