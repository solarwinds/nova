import { Component } from "@angular/core";

@Component({
    selector: "nui-search-example",
    templateUrl: "./search-test.example.component.html",
})
export class SearchTestExampleComponent {
    public active = false;
    public captureFocus = true;
    public name = "example-name";
    public searchKey: string;
    public stringToSearch = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec efficitur rutrum lacus id vulputate.
        Integer eu ex eu augue efficitur luctus quis ac elit. Nam odio est, iaculis nec varius id, congue erat.
        Nullam mi lectus, gravida quis pretium sit amet, accumsan non elit. In tempus commodo sem ac vulputate.
        Sed vel sagittis purus. Integer non ornare felis. Sed aliquam, purus et euismod tincidunt, felis ligula
        fermentum mi, eget commodo nisl orci efficitur dui. Etiam interdum justo magna consequat, vitae
        hendrerit mi aliquam. Sed non ex eu purus ornare lobortis tempus id est. Aenean dictum at dui sit amet mollis.
        Phasellus mauris arcu, blandit id congue vitae, elementum amet enim.
        Pellentesque et facilisis leo, sit amet rhoncus magna. Integer commodo lobortis arcu et bibendum.
        Pellentesque sagittis magna sed tellus volutpat, sed eleifend justo ornare.
        Fusce porttitor laoreet dui a mollis.
    `;
    public value: string;

    public interval = 2000;

    public onCancel(value: string) {
        this.value = "";
        this.searchKey = "";
    }

    public onFocusChange(event: boolean) {
        this.captureFocus = event;
    }

    public onInputChange(value: string) {
        this.value = value;
    }

    public onSearch(value: string) {
        this.doSearch(value);
    }

    public setFocus() {
        this.captureFocus = true;
        setTimeout(() => {
            this.captureFocus = false;
        }, this.interval);
    }

    private doSearch(value: string) {
        this.searchKey = value;
    }
}
