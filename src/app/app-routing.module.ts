import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path:'main',
    loadChildren: () => import('./landing-page/landing-page.module').then( mod => mod.LandingPageModule )
  },
  {
    path:'system',
    loadChildren: () => import('./main/main.module').then( mod => mod.MainModule )
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
