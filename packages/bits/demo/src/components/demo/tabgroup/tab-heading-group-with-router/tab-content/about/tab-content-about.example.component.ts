import { Component } from "@angular/core";

@Component({
    selector: "nui-content-about-example",
    templateUrl: "./tab-content-about.example.component.html",
})
export class TabContentAboutExampleComponent {
    public content: string = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed erat eget
    velit elementum ultricies vitae vel mauris. Nam egestas fermentum ex id interdum.
    In in dignissim libero. Suspendisse commodo pellentesque purus, sit amet tempor enim
    viverra at. Nam cursus sed lectus imperdiet imperdiet. Pellentesque vel tincidunt dolor.
    Aliquam bibendum ac lectus id consectetur. Sed eget purus id dolor ultricies rhoncus.
    Vivamus ac magna nulla. Nam vel pellentesque ex. Nunc eu metus euismod, dignissim lorem id,
    pulvinar tellus. Vestibulum sed nisi quis sapien varius vehicula. Proin dictum eu mauris quis aliquet.
    Vestibulum accumsan eros ac mollis hendrerit. Aenean aliquet sem eros, sit amet ornare tellus tincidunt vitae.`;

    public pageTitle: string = "About";
}
