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

import { IInteractionPayload } from "../components/providers/interaction/interaction-handler";
import { mockLoggerService } from "../mocks";
import { UrlInteractionService } from "./url-interaction.service";

const interaction: IInteractionPayload<any> = {
    data: {
        units: `out of 5 stars`,
        label: `Average Rating`,
        value: 0,
        link2: "https://www.google.com/",
    },
};

describe("UrlInteractionService > ", () => {
    const service = new UrlInteractionService(mockLoggerService);

    it("should parse template correctly", () => {
        expect(service.template("${data.link2}", interaction)).toBe(
            interaction.data.link2
        );
        expect(service.template("${data.link2}", interaction)).toBe(
            "https://www.google.com/"
        );

        expect(
            service.template("${data.label} is ${data.units}", interaction)
        ).toBe(interaction.data.label + " is " + interaction.data.units);
        expect(
            service.template("${data.label} is ${data.units}", interaction)
        ).toBe("Average Rating is out of 5 stars");

        expect(
            service.template(
                "${data.label} !@#$%^&*()_+/*-+1324657890 ${data.value}",
                interaction
            )
        ).toBe(
            interaction.data.label +
                " !@#$%^&*()_+/*-+1324657890 " +
                interaction.data.value
        );
        expect(
            service.template(
                "${data.label} !@#$%^&*()_+/*-+1324657890 ${data.value}",
                interaction
            )
        ).toBe("Average Rating !@#$%^&*()_+/*-+1324657890 0");

        expect(service.template("${data.link2}", interaction)).not.toBe(
            "Average Rating"
        );
    });

    it("should return empty string if property doesn't exist", () => {
        expect(service.template("${data.link3}", interaction)).toBe("");
    });

    it("should return empty string if property doesn't exist", () => {
        expect(service.template("${data.link3.title}", interaction)).toBe("");
    });
});
