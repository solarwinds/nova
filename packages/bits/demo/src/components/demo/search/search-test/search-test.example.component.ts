// © 2022 SolarWinds Worldwide, LLC. All rights reserved.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to
//  deal in the Software without restriction, including without limitation the
//  rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  sell copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.

import { Component } from "@angular/core";

@Component({
    selector: "nui-search-example",
    templateUrl: "./search-test.example.component.html",
    standalone: false
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

    public isInErrorState = true;

    public onCancel(value: string): void {
        this.value = "";
        this.searchKey = "";
    }

    public onFocusChange(event: boolean): void {
        this.captureFocus = event;
    }

    public onInputChange(value: string): void {
        this.value = value;
    }

    public onSearch(value: string): void {
        this.doSearch(value);
    }

    public setFocus(): void {
        this.captureFocus = true;
        setTimeout(() => {
            this.captureFocus = false;
        }, this.interval);
    }

    private doSearch(value: string): void {
        this.searchKey = value;
    }
}
