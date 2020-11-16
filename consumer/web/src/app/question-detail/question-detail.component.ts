import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { DialogService } from "@solarwinds/nova-bits";
import cloneDeep from "lodash/cloneDeep";
import find from "lodash/find";
import findIndex from "lodash/findIndex";

import { PostService } from "../services/post.service";
import { QuestionService } from "../services/question.service";
import { UserService } from "../services/user.service";
import { VoteService } from "../services/vote.service";
import { IPost, IPostUpdateInput, IQuestion } from "../types";

@Component({
    selector: "rd-question-detail",
    templateUrl: "./question-detail.component.html",
})
export class QuestionDetailComponent implements OnInit {
    public question: IQuestion;
    public questionId: string;
    public answerPostForm: FormGroup;
    public questionForm: FormGroup;
    public editing = false;
    public answerMetadata: { [key: string]: { busy: boolean, editing: boolean } } = {};

    constructor(private route: ActivatedRoute,
                private router: Router,
                private questionService: QuestionService,
                private postService: PostService,
                private voteService: VoteService,
                private dialogService: DialogService,
                private formBuilder: FormBuilder,
                private userService: UserService,
                private i18n: I18n) {
        this.questionId = this.route.snapshot.paramMap.get("id");
    }

    public onAnswerFormReady(name: string, form: FormGroup) {
        this.answerPostForm = form;
    }

    public onQuestionPostFormReady(name: string, form: FormGroup) {
        this.questionForm.setControl(name, form);
    }

    public async ngOnInit() {
        this.question = cloneDeep(await this.questionService.getQuestion(this.questionId).toPromise());

        if (!this.question) {
            this.router.navigate(["/404"]);
        }

        this.updateAnswerMetadata();

        this.questionForm = this.formBuilder.group({
            title: this.formBuilder.control(this.question.title, [
                Validators.required,
                Validators.minLength(10),
            ]),
        });
    }

    public updateAnswerMetadata() {
        this.answerMetadata = {};
        if (!this.question || !this.question.answerPosts) {
            return;
        }

        for (const answer of this.question.answerPosts) {
            this.answerMetadata[answer._id] = this.answerMetadata[answer._id] || {editing: false, busy: false};
        }
    }

    public getAcceptedAnswerIcon(answerId: string) {
        if (!this.question.acceptedAnswerPostId) {
            return "step-complete";
        } else if (this.question.acceptedAnswerPostId === answerId) {
            return "status_up";
        } else {
            return "status_testing";
        }
    }

    public getUserVote(postId: string): number {
        const userVoteObj = find(this.question.userVotes, v => postId === v.postId);
        return userVoteObj ? userVoteObj.vote : 0;
    }

    public getVotingDisabled(): boolean {
        return !this.userService.currentUser;
    }

    public onCancelEditing() {
        this.editing = false;
    }

    public async onQuestionUpdate() {
        const questionFormModel = this.questionForm.getRawValue();
        const result = await this.questionService.updateQuestion({
            id: this.question._id,
            title: questionFormModel.title,
            text: questionFormModel.questionPost.text,
        }).toPromise();
        this.question = result;
        this.editing = false;
    }

    public async onAcceptedAnswerChange(answerPostId: string) {
        const result = await this.questionService.markAcceptedAnswer({
            questionId: this.question._id,
            acceptedAnswerPostId: this.question.acceptedAnswerPostId ? null : answerPostId,
        }).toPromise();

        this.question = result;
    }

    public async onAnswerVoteChange(post: IPost, vote: number) {
        const result = await this.voteService.registerVote({
            postId: post._id,
            vote: vote,
        }).toPromise();

        const answerPost = find(this.question.answerPosts, (ap) => ap._id === post._id);
        const userVoteIndex = findIndex(this.question.userVotes, v => post._id === v.postId);
        const userVoteDelta = vote - (userVoteIndex >= 0 ? this.question.userVotes[userVoteIndex].vote : 0);
        answerPost.votes = answerPost.votes + userVoteDelta;

        if (userVoteIndex >= 0) {
            this.question.userVotes[userVoteIndex] = result;
        } else {
            this.question.userVotes.push(result);
        }
    }

    public async onQuestionVoteChange(vote: number) {
        const result = await this.voteService.registerVote({
            postId: this.question.questionPost._id,
            vote: vote,
        }).toPromise();

        const userVoteIndex = findIndex(this.question.userVotes, v => this.question.questionPost._id === v.postId);
        const userVoteDelta = vote - (userVoteIndex >= 0 ? this.question.userVotes[userVoteIndex].vote : 0);
        this.question.questionPost.votes = this.question.questionPost.votes + userVoteDelta;

        if (userVoteIndex >= 0) {
            this.question.userVotes[userVoteIndex] = result;
        } else {
            this.question.userVotes.push(result);
        }
    }

    public onQuestionEdit() {
        this.editing = true;
    }

    public async onQuestionDelete(): Promise<void> {
        const dialogRef = this.dialogService.confirm({
            message: this.i18n("Do you really want to delete the question?"),
            confirmText: this.i18n("Delete"),
            dismissText: this.i18n("Cancel"),
        });
        if (await dialogRef.result) {
            await this.questionService.deleteQuestion(this.question._id).toPromise();
            await this.router.navigate(["/questions"]);
        }
    }

    public async submitAnswer() {
        const answerModel = this.answerPostForm.getRawValue();
        const result = await this.questionService.answerQuestion({
            id: this.questionId,
            text: answerModel.text,
            author: answerModel.author,
        }).toPromise();

        this.question = cloneDeep(result);
        this.updateAnswerMetadata();

        this.answerPostForm.reset();
    }

    public async onDeleteAnswer(answerId: string) {
        const dialogRef = this.dialogService.confirm({
            message: this.i18n("Do you really want to delete this answer?"),
            confirmText: this.i18n("Delete"),
            dismissText: this.i18n("Cancel"),
        });

        const result = await dialogRef.result;
        if (!result) {
            return;
        }

        const question = await this.questionService.deleteAnswer({
            questionId: this.questionId,
            answerId,
        }).toPromise();

        this.question = cloneDeep(question);
        this.updateAnswerMetadata();
    }

    public async onUpdateAnswer(input: IPostUpdateInput) {
        try {
            this.answerMetadata[input.id].busy = true;
            const result = await this.postService.updatePost(input).toPromise();

            const newAnswerPosts = this.question.answerPosts.map(ap => ap._id === result._id ? result : ap);
            this.question.answerPosts = newAnswerPosts;
        } finally {
            this.answerMetadata[input.id].editing = false;
            this.answerMetadata[input.id].busy = false;
        }
    }
}
