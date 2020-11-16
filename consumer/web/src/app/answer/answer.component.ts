import { Component, EventEmitter, Input, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";


import { IPost, IPostUpdateInput } from "../types";

@Component({
    selector: "rd-answer",
    templateUrl: "./answer.component.html",
})
export class AnswerComponent {
    @Input() public post: IPost = <any>{};
    @Input() public busy = false;
    @Input() public acceptedAnswerIcon: string;
    @Input() public acceptAnswerDisabled = false;
    @Input() public votingDisabled = true;
    @Input() public editing = false;
    @Input() public votes = 0;
    @Input() public userVote = 0;

    @Output() public deleteAnswer = new EventEmitter<string>();
    @Output() public updateAnswer = new EventEmitter<IPostUpdateInput>();
    @Output() public editingChange = new EventEmitter<boolean>();
    @Output() public acceptedAnswerChange = new EventEmitter<string>();
    @Output() public voteChange = new EventEmitter<number>();
    public answerForm: FormGroup;

    constructor() {}

    public onCancelEditing() {
        this.editingChange.emit(false);
    }

    public async onUpdateAnswer() {
        this.updateAnswer.emit({
            id: this.post._id,
            text: this.answerForm.getRawValue().text,
        });
        this.answerForm = null;
    }

    public onEditAnswer() {
        this.editingChange.emit(true);
    }

    public onDeleteAnswer() {
        this.deleteAnswer.emit(this.post._id);
    }

    public onFormReady(name: string, form: FormGroup) {
        this.answerForm = form;
    }

    public onAcceptedAnswerClick() {
        this.acceptedAnswerChange.emit(this.post._id);
    }

    public onVote(vote: number) {
        this.voteChange.emit(vote);
    }
}
