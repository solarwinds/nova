import { Component } from "@angular/core";

@Component({
    selector: "textbox-visual-test",
    templateUrl: "./textbox-visual-test.component.html",
})

export class TextboxVisualTestComponent {
    public isRequired = true;
    public value = "";
    public textExample: string = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquid dolores ' +
        'ex harum itaque laborum laudantium quae quo, soluta suscipit voluptate. Accusamus aliquid amet architecto, ' +
        'doloremque ducimus eveniet facere facilis fugit itaque';

    public isInErrorState() {
        return this.isRequired && !this.value;
    }

    public textChanged($event: string) {
        this.value = $event;
    }
}
