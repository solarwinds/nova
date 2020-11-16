import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: '<%= selector %>',
    templateUrl: './<%= dasherize(name) %>.component.html',
    styleUrls: ['./<%= dasherize(name) %>.component.<%= styleext %>'],
    encapsulation: ViewEncapsulation.<%= viewEncapsulation %>,
    changeDetection: ChangeDetectionStrategy.<%= changeDetection %>
})
export class <%= classify(name) %>Component implements OnInit {

    constructor() { }

    ngOnInit() {
    }

}
