import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { Context } from "../../context";
import { MongoDbService } from "../../services/mongodb-service";

import { RegisterVoteInput } from "./inputs/register-vote-input";
import { Vote } from "./vote";

@Resolver(objectType => Vote)
export class VoteResolver {
    private dataService = MongoDbService.getInstance();

    @Mutation(returns => Vote)
    async registerVote(@Arg("input", type => RegisterVoteInput) input: RegisterVoteInput,
                       @Ctx() ctx: Context): Promise<Vote> {
        return await this.dataService.registerVote(input, ctx.user && ctx.user.username);
    }

    @Query(returns => [Vote])
    async userVotes(@Arg("userId") userId: string): Promise<Vote[]> {
        return await this.dataService.getUserVotes(userId);
    }
}
