import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatStepperModule } from '@angular/material/stepper';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

const materialComponents:any[] = [
  MatStepperModule,
  MatButtonModule,
  MatMenuModule,
  MatIconModule,
  MatListModule,
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
