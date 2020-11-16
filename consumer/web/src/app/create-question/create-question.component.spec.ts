import { DatePipe, Location } from "@angular/common";
import { Provider } from "@angular/core";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import Spy = jasmine.Spy;
import { I18n } from "@ngx-translate/i18n-polyfill";
import { NuiModule } from "@solarwinds/nova-bits";
import { Apollo } from "apollo-angular";
import { of } from "rxjs";

import { PostFormComponent } from "../post-form/post-form.component";
import { QuestionService } from "../services/question.service";

import { CreateQuestionComponent } from "./create-question.component";

describe("CreateQuestionComponent", () => {
    let component: CreateQuestionComponent;
    let fixture: ComponentFixture<CreateQuestionComponent>;
    let questionService: QuestionService;
    let location: Location;

    class EmptyComponent {
    }

    beforeEach(async(() => {
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
                CreateQuestionComponent,
                PostFormComponent,
            ],
            providers: [
                DatePipe,
                Apollo,
                QuestionService,
                { provide: I18n, useValue: (translateThing: string) => translateThing } as Provider,
            ],
        }).compileComponents();

        questionService = TestBed.get(QuestionService);
        fixture = TestBed.createComponent(CreateQuestionComponent);
        location = TestBed.get(Location);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    describe("submit", () => {
        let addQuestion: Spy;

        beforeEach(() => {
            addQuestion = spyOn(questionService, "addQuestion").and.returnValue(of(1));
        });

        describe("for valid form data", () => {

            beforeEach(() => {
                component.questionForm.controls["title"].patchValue("title that is long enough");
                (component.questionForm.controls["postForm"] as FormGroup).controls["author"].patchValue("author");
                (component.questionForm.controls["postForm"] as FormGroup).controls["text"].patchValue("body");
                fixture.detectChanges();
            });

            it("should submit form data", async () => {
                await component.submit();
                expect(addQuestion).toHaveBeenCalledWith({
                    text: "body",
                    author: "author",
                    title: "title that is long enough",
                });
            });

            it("should redirect to /questions", async () => {
                expect(location.path()).toBe("");
                await component.submit();
                expect(location.path()).toBe("/questions");
            });
        });

        it("should not submit invalid form data", async () => {
            await component.submit();
            expect(addQuestion).not.toHaveBeenCalled();
        });
    });
});
