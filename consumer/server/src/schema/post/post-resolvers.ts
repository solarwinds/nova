import { Arg, Mutation, Resolver } from "type-graphql";

import { MongoDbService } from "../../services/mongodb-service";

import { PostUpdateInput } from "./inputs/post-update-input";
import { Post } from "./post";

@Resolver(objectType => Post)
export class PostResolver {
    private dataService = MongoDbService.getInstance();

    @Mutation(returns => Post)
    async updatePost(@Arg("input", type => PostUpdateInput)
                     input: PostUpdateInput): Promise<Post> {
        const updatedPost = await this.dataService.updatePost(input);
        return updatedPost;
    }
}
