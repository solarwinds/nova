import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";

import { Context } from "../../context";
import { MongoDbService } from "../../services/mongodb-service";

import { AddQuestionInput } from "./inputs/add-question-input";
import { DeleteAnswerInput } from "./inputs/delete-answer-input";
import { MarkAcceptedAnswerInput } from "./inputs/mark-accepted-answer-input";
import { AnswerInput } from "./inputs/question-answer-input";
import { QuestionUpdateInput } from "./inputs/question-update-input";
import { QuestionsInput } from "./inputs/questions-input";
import { Question } from "./question";
import { QuestionsPayload } from "./questions-payload";

@Resolver(objectType => Question)
export class QuestionResolver {
    private dataService = MongoDbService.getInstance();

    @Query(returns => Question, {nullable: true, description: "Get Question"})
    async question(@Arg("id") id: string, @Ctx() ctx: Context): Promise<Question | undefined> {
        return await this.dataService.getQuestion(id, ctx.user && ctx.user.username);
    }

    @Query(returns => QuestionsPayload, {nullable: true, description: "Get search, pagination and sorting " })
    async questions(
        @Arg("input", type => QuestionsInput)
        input: QuestionsInput
    ): Promise<QuestionsPayload | undefined> {
            const questionsPayloadArr = await this.dataService.getQuestions(input);
        return questionsPayloadArr[0];
    }
   
    @Query(returns => [Question], {nullable: true, description: "Get Question by tag"})
    async questionsByTag(@Arg("tag") tag: string,
                         @Ctx() ctx: Context): Promise<Question[] | undefined> {
        return await this.dataService.getQuestionsByTag(tag, ctx.user && ctx.user.username);
    }

    @Mutation(returns => Question)
    async addQuestion(@Arg("input", type => AddQuestionInput) input: AddQuestionInput,
                      @Ctx() ctx: Context): Promise<Question> {
        return await this.dataService.addQuestion(input, ctx.user && ctx.user.username);
    }

    @Mutation(returns => Question)
    async updateQuestion(@Arg("input", type => QuestionUpdateInput) input: QuestionUpdateInput,
                         @Ctx() ctx: Context): Promise<Question> {
        return await this.dataService.updateQuestion(input, ctx.user && ctx.user.username);
    }

    @Mutation(returns => Boolean)
    async deleteQuestion(@Arg("id") id: string): Promise<boolean> {
        return await this.dataService.deleteQuestion(id);
    }

    @Mutation(returns => Question)
    async deleteAnswer(@Arg("input", type => DeleteAnswerInput) input: DeleteAnswerInput,
                       @Ctx() ctx: Context): Promise<Question> {
        return await this.dataService.deleteAnswer(input, ctx.user && ctx.user.username);
    }

    @Mutation(returns => Question)
    async markAcceptedAnswer(@Arg("input", type => MarkAcceptedAnswerInput) input: MarkAcceptedAnswerInput,
                             @Ctx() ctx: Context): Promise<Question> {
        return await this.dataService.markAcceptedAnswer(input, ctx.user && ctx.user.username);
    }

    @Authorized()
    @Mutation(returns => Question)
    async answerQuestion(@Arg("input", type => AnswerInput) input: AnswerInput,
                         @Ctx() ctx: Context): Promise<Question> {
        return await this.dataService.answerQuestion(input, ctx.user && ctx.user.username);
    }
}
