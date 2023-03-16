import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { MatButtonModule } from '@angular/material/button';

const materialComponents:any[] = [
  MatStepperModule,
  MatButtonModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...materialComponents
  ],
  exports:[
    ...materialComponents
  ]
})
export class MaterialModule { }
