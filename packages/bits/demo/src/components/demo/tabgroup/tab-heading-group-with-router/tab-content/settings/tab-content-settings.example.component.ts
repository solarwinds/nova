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

import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: "nui-content-settings-example",
    templateUrl: "./tab-content-settings.example.component.html",
})
export class TabContentSettingsExampleComponent implements OnInit {
    public content: string =
        "You can change your password using the form below:";
    public tabTitle: string = "Account Settings";

    public dynamicForm: FormGroup;
    public visibleRadio: boolean;

    constructor(private formBuilder: FormBuilder) {}

    public ngOnInit(): void {
        this.dynamicForm = this.formBuilder.group({
            password: this.formBuilder.control("", Validators.required),
            confirmPassword: this.formBuilder.control(
                { value: "", disabled: true },
                Validators.required
            ),
        });
    }

    public onPasswordBlurred(): void {
        if (this.dynamicForm.controls.password.valid) {
            this.dynamicForm.controls.confirmPassword.enable();
        } else {
            this.dynamicForm.controls.confirmPassword.disable();
        }
    }

    public toggleRadio(): void {
        this.visibleRadio = !this.visibleRadio;
    }
}
