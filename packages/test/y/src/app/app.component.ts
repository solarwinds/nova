import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        CommonModule,
        RouterOutlet,
        RouterLinkActive,
        RouterLink,
    ],
    template: `
        <nav>
            <a routerLink="/dash" routerLinkActive="active" ariaCurrentWhenActive="page">dash</a>
        </nav>
        <router-outlet></router-outlet>
    `,
    styles: [],
})
export class AppComponent {

}
