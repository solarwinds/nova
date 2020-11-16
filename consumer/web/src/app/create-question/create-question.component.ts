import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IToastService, ToastService } from "@solarwinds/nova-bits";

import { QuestionService } from "../services/question.service";

@Component({
    selector: "rd-create-question",
    templateUrl: "./create-question.component.html",
})
export class CreateQuestionComponent implements OnInit {

    public title: string;
    public questionForm: FormGroup;

    constructor(private router: Router,
                private questionService: QuestionService,
                private formBuilder: FormBuilder,
                @Inject(ToastService) private toastService: IToastService) {
    }

    ngOnInit() {
        this.questionForm = this.formBuilder.group({
            title: this.formBuilder.control("", [
                Validators.required,
                Validators.minLength(10),
            ]),
        });
    }

    public onFormReady(name: string, form: FormGroup) {
        this.questionForm.setControl(name, form);
    }

    public async submit() {
        if (this.questionForm.invalid) {
            this.toastService.error({
                message: "Please check all fields in a form",
                title: "Validation error in a form",
            });
            return;
        }
        const questionModel = this.questionForm.getRawValue();
        await this.questionService.addQuestion({
            title: questionModel.title,
            text: questionModel.postForm.text,
            author: questionModel.postForm.author,
        }).toPromise();

        this.router.navigate(["/questions"]);
    }

}
