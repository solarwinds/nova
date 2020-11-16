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
