import {Routes} from '@angular/router';

export const routes: Routes = [
    {
        path: 'dash',
        loadChildren: () => import('./dash.module').then(m => m.AppModule)
    }
];
