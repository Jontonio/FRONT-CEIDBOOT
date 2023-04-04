import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

const materialComponents:any[] = [
  MatStepperModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  // MatSelectModule,
  // MatFormFieldModule
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
