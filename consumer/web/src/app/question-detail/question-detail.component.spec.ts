import { Location } from "@angular/common";
import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ActivatedRoute, convertToParamMap } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { DialogService, NuiModule } from "@solarwinds/nova-bits";
import { Apollo } from "apollo-angular";
import Spy = jasmine.Spy;
import cloneDeep from "lodash/cloneDeep";
import { of } from "rxjs";

import { AnswerComponent } from "../answer/answer.component";
import { FromNowPipe } from "../pipes/from-now.pipe";
import { PostFormComponent } from "../post-form/post-form.component";
import { PostComponent } from "../post/post.component";
import { mockData } from "../question-list/question-list.mockData";
import { PostService } from "../services/post.service";
import { QuestionService } from "../services/question.service";
import { UserService } from "../services/user.service";
import { VoteService } from "../services/vote.service";
import { IPost, IPostUpdateInput, IQuestion, IRegisterVoteInput, IVote } from "../types";

import { QuestionDetailComponent } from "./question-detail.component";

describe("QuestionDetailComponent", () => {
    let component: QuestionDetailComponent;
    let fixture: ComponentFixture<QuestionDetailComponent>;
    let questionService: QuestionService;
    let voteService: VoteService;
    let postService: PostService;
    let dialogService: DialogService;
    let getQuestionSpy: Spy;
    let testQuestion: IQuestion;
    let location: Location;
    let confirmSpy: Spy;
    const mockUserService: UserService = new UserService();
    mockUserService.currentUser = { username: "testuser" };
    class EmptyComponent {
    }

    beforeEach(async(() => {
        testQuestion = cloneDeep(mockData.testQuestions[0]);

        TestBed.configureTestingModule({
            imports: [
                NuiModule,
                RouterTestingModule.withRoutes([{
                    path: "questions",
                    component: EmptyComponent,
                }]),
                ReactiveFormsModule,
                FormsModule,
            ],
            declarations: [
                QuestionDetailComponent,
                AnswerComponent,
                PostFormComponent,
                PostComponent,
                FromNowPipe,
            ],
            providers: [
                QuestionService,
                PostService,
                VoteService,
                Apollo,
                {
                    provide: ActivatedRoute, useValue: {
                    snapshot: {
                        paramMap: convertToParamMap({id: testQuestion._id}),
                    },
                },
                },
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
        }).overrideComponent(QuestionDetailComponent, {
            set: {
                providers: [
                    { provide: UserService, useValue: mockUserService },
                ],
            },
        })
            .compileComponents();

        questionService = TestBed.get(QuestionService);
        voteService = TestBed.get(VoteService);
        postService = TestBed.get(PostService);
        dialogService = TestBed.get(DialogService);
        location = TestBed.get(Location);

        getQuestionSpy = spyOn(questionService, "getQuestion").and.returnValue(of(testQuestion));
        confirmSpy = spyOn(dialogService, "confirm");

        fixture = TestBed.createComponent(QuestionDetailComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it("should initialize question on url parameter", () => {
        expect(component.questionId).toBe(testQuestion._id);
        expect(getQuestionSpy).toHaveBeenCalledWith(testQuestion._id);
    });

    it("should have answer metadata for an existing answer", async(async () => {
        const expectedAnswerMetadata: { [key: string]: { busy: boolean, editing: boolean } } = {};
        expectedAnswerMetadata[component.question.answerPosts[0]._id] = { editing: false, busy: false };
        expect(component.answerMetadata).toEqual(expectedAnswerMetadata);
    }));

    describe("voting", () => {
        it("should have user votes", () => {
            expect(component.question.userVotes).toBeDefined();
        });

        it("should have a vote total", () => {
            expect(component.question.questionPost.votes).toEqual(0);
        });

        describe("getUserVote", () => {
            const expectedUserVote = -1;
            beforeEach(() => {
                component.question.userVotes = [{
                    _id: "testVoteId",
                    postId: "1",
                    vote: expectedUserVote,
                }];

                component.question.questionPost.votes = -1;
            });

            it("should get the user vote", () => {
                const userVote = component.getUserVote("1");
                expect(userVote).toEqual(expectedUserVote);
            });
        });

        describe("getVotingDisabled", () => {
            afterAll(() => {
                mockUserService.currentUser = { username: "testuser" };
            });

            it("should report that voting is disabled", () => {
                mockUserService.currentUser = null;
                const votingDisabled = component.getVotingDisabled();
                expect(votingDisabled).toEqual(true);
            });
            it("should report that voting is not disabled", () => {
                mockUserService.currentUser = { username: "testuser" };
                const votingDisabled = component.getVotingDisabled();
                expect(votingDisabled).toEqual(false);
            });
        });

        describe("onAnswerVoteChange", () => {
            let registerVoteSpy: Spy;
            let expectedArgs: IRegisterVoteInput;
            let expectedVoteResult: IVote;
            let exampleUserVote: IVote;

            beforeEach(() => {
                expectedArgs = {
                    postId: testQuestion.answerPosts[0]._id,
                    vote: 1,
                };
                expectedVoteResult = {
                    _id: "testVoteId",
                    postId: testQuestion.answerPosts[0]._id,
                    vote: 1,
                };
                exampleUserVote = {
                    _id: "testVoteId",
                    postId: "16",
                    vote: -1,
                };

                registerVoteSpy = spyOn(voteService, "registerVote").and.returnValue(of(expectedVoteResult));
            });

            it("should invoke voteService.registerVote", () => {
                component.onAnswerVoteChange(testQuestion.answerPosts[0], expectedArgs.vote);
                expect(registerVoteSpy).toHaveBeenCalledWith(expectedArgs);
            });

            it("should set the answer post votes value", async () => {
                component.question.userVotes = [exampleUserVote];

                const userVoteDelta = expectedArgs.vote - component.question.userVotes[0].vote;
                await component.onAnswerVoteChange(testQuestion.answerPosts[0], expectedArgs.vote);
                expect(component.question.answerPosts[0].votes).toEqual(userVoteDelta);
            });

            it("should update an existing user vote", async () => {
                component.question.userVotes = [exampleUserVote];

                await component.onAnswerVoteChange(testQuestion.answerPosts[0], expectedArgs.vote);
                expect(component.question.userVotes[0].vote).toEqual(expectedArgs.vote);
            });

            it("should store a non-existent user vote", async () => {
                await component.onAnswerVoteChange(testQuestion.answerPosts[0], expectedArgs.vote);
                expect(component.question.userVotes[0]).toEqual(expectedVoteResult);
            });
        });

        describe("onQuestionVoteChange", () => {
            let registerVoteSpy: Spy;
            let expectedArgs: IRegisterVoteInput;
            let expectedVoteResult: IVote;
            let exampleUserVote: IVote;

            beforeEach(() => {
                expectedArgs = {
                    postId: testQuestion.questionPost._id,
                    vote: 1,
                };
                expectedVoteResult = {
                    _id: "testVoteId",
                    postId: testQuestion.answerPosts[0]._id,
                    vote: 1,
                };
                exampleUserVote = {
                    _id: "testVoteId",
                    postId: "1",
                    vote: -1,
                };

                registerVoteSpy = spyOn(voteService, "registerVote").and.returnValue(of(expectedVoteResult));
            });

            it("should invoke VoteService.registerVote", () => {
                component.onQuestionVoteChange(expectedArgs.vote);
                expect(registerVoteSpy).toHaveBeenCalledWith(expectedArgs);
            });

            it("should set the question post votes value", async () => {
                component.question.userVotes = [exampleUserVote];

                const userVoteDelta = expectedArgs.vote - component.question.userVotes[0].vote;
                await component.onQuestionVoteChange(expectedArgs.vote);
                expect(component.question.questionPost.votes).toEqual(userVoteDelta);
            });

            it("should update an existing user vote", async () => {
                component.question.userVotes = [exampleUserVote];

                await component.onQuestionVoteChange(expectedArgs.vote);
                expect(component.question.userVotes[0].vote).toEqual(expectedArgs.vote);
            });

            it("should store a non-existent user vote", async () => {
                await component.onQuestionVoteChange(expectedArgs.vote);
                expect(component.question.userVotes[0]).toEqual(expectedVoteResult);
            });
        });
    });

    describe("submitAnswer", () => {
        const answerPost: IPost = {
            _id: "17",
            text: "Answer",
            author: "Answer author",
            votes: 0,
            creationDate: new Date(1999, 7, 16, 19, 20, 30, 123),
            lastUpdatedDate: new Date(1999, 7, 16, 19, 20, 30, 123),
        };
        let answerQuestionSpy: Spy;
        let resetSpy: Spy;

        beforeEach(async () => {
            testQuestion.answerPosts.push(answerPost);
            answerQuestionSpy = spyOn(questionService, "answerQuestion").and.returnValue(of(testQuestion));

            fixture.detectChanges();
            spyOn(component.answerPostForm, "getRawValue").and.returnValue({
                text: answerPost.text,
                author: answerPost.author,
            });
            resetSpy = spyOn(component.answerPostForm, "reset");
            await component.submitAnswer();
        });

        it("should invoke questionService.answerQuestion", async(async () => {
            expect(answerQuestionSpy).toHaveBeenCalledWith({
                id: component.questionId,
                text: answerPost.text,
                author: answerPost.author,
            });
        }));

        it("should add the answer to question.answerPosts", async(async () => {
            expect(component.question.answerPosts).toEqual(testQuestion.answerPosts);
        }));

        it("should update the answer metadata", async () => {
            expect(Object.keys(component.answerMetadata).length).toEqual(2);
        });

        it("should invoke reset on the answer form", async () => {
            expect(resetSpy).toHaveBeenCalled();
        });
    });

    describe("updateAnswer", () => {
        it("should update the answer", async(async () => {
            const newText = "updated text";
            const answerPost = component.question.answerPosts[0];

            const expectedPayload = {
                _id: answerPost._id,
                text: newText,
                author: "author",
                creationDate: new Date(1998, 7, 16, 19, 20, 30, 123),
                lastUpdatedDate: new Date(1999, 7, 16, 19, 20, 30, 123),
                votes: 0,
            };

            const updatePostSpy = spyOn(postService, "updatePost").and.returnValue(of(expectedPayload));

            const updateAnswerInput: IPostUpdateInput = {
                id: answerPost._id,
                text: newText,
            };

            // Exercise
            await component.onUpdateAnswer(updateAnswerInput);

            const updatedPost = component.question.answerPosts[0];
            // Verify
            expect(updatePostSpy).toHaveBeenCalledWith(updateAnswerInput);
            expect(updatedPost).toEqual(expectedPayload);
        }));
    });

    describe("onDeleteAnswer", () => {
        let deleteAnswerSpy: Spy;

        beforeEach(() => {
            deleteAnswerSpy = spyOn(questionService, "deleteAnswer");
        });

        it("should delete the answer", async(async () => {
            deleteAnswerSpy.and.returnValue(of({
                answerPosts: [],
            }));

            confirmSpy.and.returnValue({
                result: Promise.resolve(true),
            });

            await component.onDeleteAnswer(testQuestion.answerPosts[0]._id);

            expect(confirmSpy).toHaveBeenCalled();
            expect(deleteAnswerSpy).toHaveBeenCalledWith({
                questionId: component.questionId,
                answerId: testQuestion.answerPosts[0]._id,
            });
            expect(component.question.answerPosts).toEqual([]);
        }));

        it("should not delete the answer if not confirmed", async(async () => {
            confirmSpy.and.returnValue({
                result: Promise.resolve(false),
            });

            await component.onDeleteAnswer(testQuestion.answerPosts[0]._id);

            expect(confirmSpy).toHaveBeenCalled();
            expect(deleteAnswerSpy).not.toHaveBeenCalled();
            expect(component.question.answerPosts.length).toEqual(1);
        }));

        it("should remove answer metadata for a deleted answer", async(async () => {
            deleteAnswerSpy.and.returnValue(of({
                answerPosts: [],
            }));

            confirmSpy.and.returnValue({
                result: Promise.resolve(true),
            });

            await component.onDeleteAnswer(testQuestion.answerPosts[0]._id);

            expect(component.answerMetadata).toEqual({});
        }));
    });

    describe("onQuestionDelete", () => {
        let deleteQuestionSpy: Spy;

        beforeEach(() => {
            deleteQuestionSpy = spyOn(questionService, "deleteQuestion").and.returnValue(of({}));
        });

        it("should delete the question", async(async () => {
            confirmSpy.and.returnValue({
                result: Promise.resolve(true),
            });

            await component.onQuestionDelete();

            expect(confirmSpy).toHaveBeenCalled();
            expect(deleteQuestionSpy).toHaveBeenCalledWith(testQuestion._id);
        }));

        it("should not delete the question if not confirmed", async(async () => {
            confirmSpy.and.returnValue({
                result: Promise.resolve(false),
            });

            await component.onQuestionDelete();

            expect(confirmSpy).toHaveBeenCalled();
            expect(deleteQuestionSpy).not.toHaveBeenCalled();
        }));

        it("should redirect to '/questions'", async () => {
            expect(location.path()).toBe("");

            confirmSpy.and.returnValue({
                result: Promise.resolve(true),
            });

            await component.onQuestionDelete();
            expect(location.path()).toBe("/questions");
        });

        it("should not redirect to '/questions' if not confirmed", async () => {
            expect(location.path()).toBe("");

            confirmSpy.and.returnValue({
                result: Promise.resolve(false),
            });

            await component.onQuestionDelete();
            expect(location.path()).toBe("");
        });
    });

    describe("onQuestionEdit", () => {
        it("should set editing to true", () => {
            expect(component.editing).toBe(false);
            component.onQuestionEdit();
            expect(component.editing).toBe(true);
        });
    });

    describe("onQuestionUpdate", () => {
        const expectedText = "expected text";
        const expectedTitle = "expected title";
        let updateQuestionSpy: Spy;

        beforeEach(async(async () => {
            updateQuestionSpy = spyOn(questionService, "updateQuestion");

            component.onQuestionEdit();
            fixture.detectChanges();

            component.questionForm.patchValue({
                "title": expectedTitle,
                "questionPost": {
                    "text": expectedText,
                },
            });
        }));

        it("should update the question via question service", async(async () => {
            updateQuestionSpy.and.returnValue(of({}));
            await component.onQuestionUpdate();
            expect(updateQuestionSpy).toHaveBeenCalledWith({
                id: testQuestion._id,
                title: expectedTitle,
                text: expectedText,
            });
        }));

        it("should update the component text and title", async(async () => {
            updateQuestionSpy.and.returnValue(of(
                {
                    title: expectedTitle,
                    questionPost: {
                        text: expectedText,
                    },
                }
            ));
            await component.onQuestionUpdate();

            expect(component.question.questionPost.text).toEqual(expectedText);
            expect(component.question.title).toEqual(expectedTitle);
        }));

        it("should reset editing", async(async () => {
            updateQuestionSpy.and.returnValue(of({}));
            await component.onQuestionUpdate();

            expect(component.editing).toEqual(false);
        }));
    });

    describe("onAcceptedAnswerChange", () => {
        let markAcceptedAnswerSpy: Spy;

        beforeEach(() => {
            markAcceptedAnswerSpy = spyOn(questionService, "markAcceptedAnswer");
        });

        it("should invoke questionService.markAcceptedAnswer with an empty acceptedAnswerPostId", () => {
            markAcceptedAnswerSpy.and.returnValue(of({}));
            component.onAcceptedAnswerChange("");
            expect(markAcceptedAnswerSpy).toHaveBeenCalledWith({
                questionId: testQuestion._id,
                acceptedAnswerPostId: "",
            });
        });

        it("should invoke questionService.markAcceptedAnswer with an non-empty acceptedAnswerPostId", () => {
            markAcceptedAnswerSpy.and.returnValue(of({}));
            component.onAcceptedAnswerChange(testQuestion.answerPosts[0]._id);
            expect(markAcceptedAnswerSpy).toHaveBeenCalledWith({
                questionId: testQuestion._id,
                acceptedAnswerPostId: testQuestion.answerPosts[0]._id,
            });
        });

        it("should mark an answer as accepted", () => {
            markAcceptedAnswerSpy.and.returnValue(of(
                {acceptedAnswerPostId: testQuestion.answerPosts[0]._id}
            ));
            component.onAcceptedAnswerChange(testQuestion.answerPosts[0]._id);
            expect(component.question).toEqual(testQuestion);
        });
    });

    describe("getAcceptedAnswerIcon", () => {
        it("should return 'step-complete' if the acceptedAnswerPostId is empty", () => {
            component.question.acceptedAnswerPostId = "";
            expect(component.getAcceptedAnswerIcon("test_id")).toEqual("step-complete");
        });

        it("should return 'status_up' if the acceptedAnswerPostId is equal to the id passed as an argument", () => {
            component.question.acceptedAnswerPostId = "test_id";
            expect(component.getAcceptedAnswerIcon("test_id")).toEqual("status_up");
        });

        it("should return 'status_testing' if acceptedAnswerPostId neither matches the id passed as an argument nor is empty", () => {
            component.question.acceptedAnswerPostId = "test_id";
            expect(component.getAcceptedAnswerIcon("different_test_id")).toEqual("status_testing");
        });
    });
});
