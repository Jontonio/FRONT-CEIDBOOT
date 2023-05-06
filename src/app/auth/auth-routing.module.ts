import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthComponent } from "./pages/auth/auth.component";
import { LoginComponent } from "./pages/login/login.component";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { ChangePasswordComponent } from "./pages/change-password/change-password.component";

const routes: Routes = [
  {
    path:'',
    component: AuthComponent,
    children:[
      { path:'login', component:LoginComponent },
      { path:'reset-password', component:ResetPasswordComponent },
      { path:'change-password/:uui', component:ChangePasswordComponent },
    ]
  },
  { path:'**', redirectTo:'login'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
