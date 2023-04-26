import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainConfigComponent } from './pages/main-config/main-config.component';
import { ChildrenMainComponent } from './pages/children-main/children-main.component';

const routes: Routes = [
  {
    path:'', component:MainConfigComponent,
    children:[
      { path:'general', component:ChildrenMainComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigRoutingModule { }
