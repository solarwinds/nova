import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { I18n } from "@ngx-translate/i18n-polyfill";
import { NuiModule } from "@solarwinds/nova-bits";

import { FromNowPipe } from "../pipes/from-now.pipe";
import { PostFormComponent } from "../post-form/post-form.component";
import { PostComponent } from "../post/post.component";
import { IPost } from "../types";

import { AnswerComponent } from "./answer.component";

describe("AnswerComponent", () => {
    let component: AnswerComponent;
    let fixture: ComponentFixture<AnswerComponent>;

    const now = new Date();
    const mockPost: IPost = {
        _id: "1",
        text: "expected text",
        author: "post author",
        creationDate: now,
        lastUpdatedDate: null,
        votes: 0,
    };

    beforeEach(async(async () => {
        await TestBed.configureTestingModule({
            imports: [
                NuiModule,
                ReactiveFormsModule,
                FormsModule,
            ],
            declarations: [
                AnswerComponent,
                PostComponent,
                PostFormComponent,
                FromNowPipe,
            ],
            providers: [
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(AnswerComponent);
        component = fixture.componentInstance;
        component.post = mockPost;
        fixture.detectChanges();
    }));

    describe("onAnswerEdit", () => {
        it("should set editing to true", () => {
            const editingEvent = spyOn(component.editingChange, "emit");
            expect(component.editing).toEqual(false);
            component.onEditAnswer();
            expect(editingEvent).toHaveBeenCalledWith(true);
        });
    });

    describe("onCancelEditing", () => {
        it("should set editing to false", () => {
            component.onEditAnswer();
            const editingEvent = spyOn(component.editingChange, "emit");
            component.onCancelEditing();
            expect(editingEvent).toHaveBeenCalledWith(false);
        });

    });

    describe("onUpdateAnswer", () => {
        const expectedText = "expected text";

        beforeEach(async () => {
            component.editing = true;
            fixture.detectChanges();

            component.answerForm.setValue({
                text: expectedText,
                author: "",
            });
        });

        it("should emit the updateAnswer event", async () => {
            const updateAnswerEvent = spyOn(component.updateAnswer, "emit");
            component.editing = true;
            fixture.detectChanges();

            await component.onUpdateAnswer();
            expect(updateAnswerEvent).toHaveBeenCalledWith({id: mockPost._id, text: expectedText});
        });
    });

    describe("onDeleteAnswer", () => {
        it("should emit postUpdate event", async () => {
            const answerDeleteEvent = spyOn(component.deleteAnswer, "emit");
            component.onDeleteAnswer();
            expect(answerDeleteEvent).toHaveBeenCalled();
        });
    });

    describe("onAnswerEdit", () => {
        it("should emit postUpdate event", async () => {
            const answerDeleteEvent = spyOn(component.deleteAnswer, "emit");
            component.onDeleteAnswer();
            expect(answerDeleteEvent).toHaveBeenCalled();
        });
    });

    describe("onVote", () => {
        it("should emit voteChange event", async () => {
            const voteChangeEvent = spyOn(component.voteChange, "emit");
            component.onVote(1);
            expect(voteChangeEvent).toHaveBeenCalledWith(1);
        });
    });
});
