import { Routes } from '@angular/router';
import { DefaultRoute } from './core/shared/domain/routes.config';

export const routes: Routes = [
  {
    path: '',
    redirectTo: DefaultRoute,
    pathMatch: 'full',
  },
  {
    path: 'app',
    title: 'Signalements',
    loadComponent: () =>
      import('./layout/components/main-layout/main-layout.component').then(
        (m) => m.MainLayoutComponent,
      ),
    children: [
      { path: '', redirectTo: DefaultRoute, pathMatch: 'full' },
      {
        path: 'reporting',
        loadChildren: () =>
          import('./features/reporting/reporting.routes').then(
            (m) => m.reportingRoutes,
          ),
      },
    ],
  },
  {
    path: 'page-not-found',
    title: 'Page non trouvée',
    loadComponent: () =>
      import(
        './layout/components/page-not-found-page/page-not-found-page.component'
      ).then((m) => m.PageNotFoundPageComponent),
  },
  { path: '**', redirectTo: 'page-not-found' },
];
