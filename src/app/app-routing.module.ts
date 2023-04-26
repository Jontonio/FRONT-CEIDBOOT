import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnauthorizedPageComponent } from './pages/unauthorized-page/unauthorized-page.component';

const routes: Routes = [
  {
    path:'main',
    loadChildren: () => import('./landing-page/landing-page.module').then( mod => mod.LandingPageModule )
  },
  {
    path:'system',
    loadChildren: () => import('./main/main.module').then( mod => mod.MainModule )
  },
  {
    path:'unauthorized-page', component:UnauthorizedPageComponent
  },
  {
    path:'**', redirectTo:'main'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
