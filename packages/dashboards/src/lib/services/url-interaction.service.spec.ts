import { IInteractionPayload } from "../components/providers/interaction/interaction-handler";
import { UrlInteractionService } from "./url-interaction.service";
import { mockLoggerService } from "../mocks";

const interaction: IInteractionPayload<any> = {
    data: {
        "units": `out of 5 stars`,
        "label": `Average Rating`,
        "value": 0,
        "link2": "https://www.google.com/",
    },
}

describe("UrlInteractionService > ", () => {
    let service: UrlInteractionService = new UrlInteractionService(mockLoggerService);

    it("should parse template correctly", () => {
        expect(service.template("${data.link2}", interaction)).toBe(interaction.data.link2);
        expect(service.template("${data.link2}", interaction)).toBe("https://www.google.com/");

        expect(service.template("${data.label} is ${data.units}", interaction))
        .toBe(interaction.data.label + " is " + interaction.data.units);
        expect(service.template("${data.label} is ${data.units}", interaction))
        .toBe("Average Rating is out of 5 stars");

        expect(service.template("${data.label} !@#$%^&*()_+/*-+1324657890 ${data.value}", interaction))
        .toBe(interaction.data.label + " !@#$%^&*()_+/*-+1324657890 " + interaction.data.value);
        expect(service.template("${data.label} !@#$%^&*()_+/*-+1324657890 ${data.value}", interaction))
        .toBe("Average Rating !@#$%^&*()_+/*-+1324657890 0");

        expect(service.template("${data.link2}", interaction)).not.toBe("Average Rating");
    });

    it("should return empty string if property doesn't exist", () => {
        expect(service.template("${data.link3}", interaction)).toBe("");
    });

    it("should return empty string if property doesn't exist", () => {
        expect(service.template("${data.link3.title}", interaction)).toBe("");
    });
});
