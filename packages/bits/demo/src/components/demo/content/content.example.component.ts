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
    templateUrl: "./content.example.component.html",
})
export class ContentExampleComponent {
    public dynamicContent = `
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras at viverra orci.
        Sed elementum lacus eget finibus varius. Fusce rhoncus libero augue.
        Cras cursus purus convallis ex laoreet, a pulvinar neque mollis.
        Maecenas fermentum, turpis non aliquam suscipit, sapien ligula feugiat lorem, a suscipit nulla
        Sed mollis iaculis varius. Suspendisse auctor finibus diam, eget laoreet tellus fermentum nec.
        Fusce iaculis varius lorem at lacinia. Curabitur et cursus eros, at congue lorem.
        Aenean urna ipsum, sollicitudin sed ultrices nec, malesuada eu lacus.
        Sed orci mauris, scelerisque vitae consectetur sit amet, venenatis a mauris.
        Donc consectetur libero eget bibendum consequat. Donec tincidunt molestie viverra.
        Nunc vel congue orci.Nullam suscipit dui sit amet justo consectetur hendrerit.
        Nullam condimentum accumsan commodo. Donec vehicula lorem dui, ac consectetur dolor mollis at.
        Vivamus et magna nec nulla maximus imperdiet et non quam. Quisque iaculis faucibus mi, et
        Praesent sit amet lacus vel nulla suscipit eleifend. Pellentesque habitant morbi tristique.
        Proin odio erat, mattis in ultrices sit amet, pharetra accumsan purus.
        In sit amet dui sed sem cursus varius. Fusce sed tortor rutrum, sagittis nulla ut, maximus urna.
        Integer pharetra nisi odio.Nulla mollis molestie mi a tincidunt. Donec egestas nibh id feugiat.
        Integer imperdiet eu justo suscipit eleifend. Praesent egestas mi ac magna congue, ut consectetur
        Morbi placerat nisi dolor, eu accumsan justo elementum ut. Suspendisse semper laoreet magna quis.
        Nullam convallis egestas auctor. Nulla elementum enim convallis, egestas justo in, pulvinar.
        Morbi nec feugiat mauris. In hac habitasse platea dictumst. Phasellus laoreet hendrerit mauris.
        Cras vitae luctus magna, a sagittis magna. Aliquam sagittis sodales nibh vel posuere.
        Maecenas pellentesque tristique aliquet.Sed ultrices erat arcu, molestie faucibus lectus et.
        Aenean porta risus at libero venenatis vestibulum. Nullam laoreet nisl nec elit laoreet sodales.
        Curabitur vehicula laoreet sapien a condimentum. Proin pharetra augue vel hendrerit mattis.
        Aenean eu dolor sed erat molestie finibus quis vel ex. Praesent auctor consequat ultricies.
        Morbi dolor eros, finibus et felis a, semper bibendum orci. Pellentesque accumsan ante finibus.
        Suspendisse ac mi eu est eleifend iaculis. Aliquam purus diam, viverra scelerisque lectus ut.
        Sed rhoncus et dui vitae rhoncus. Aliquam volutpat eu turpis at consectetur.Cum sociis natoque
        Ut vitae ultricies diam. Fusce ultrices faucibus neque ut malesuada. Morbi malesuada facilisis.
        Sed ultricies eu diam quis imperdiet. Maecenas tincidunt luctus nisl condimentum mollis.
    `;

    changeButtonText(event: any) {
        event.target.textContent = "Clicked!";
    }
}
