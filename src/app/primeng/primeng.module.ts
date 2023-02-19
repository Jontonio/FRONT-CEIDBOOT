import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * List of modules of primeng
 */
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from "primeng/tabview";
import { CardModule } from 'primeng/card';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { InputSwitchModule } from 'primeng/inputswitch';
import { FieldsetModule } from 'primeng/fieldset';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';

/**
 * array of modules
 */
const listModules:any[] = [
  MenubarModule,
  ButtonModule,
  TabViewModule,
  CardModule,
  PasswordModule,
  InputTextModule,
  InputSwitchModule,
  FieldsetModule,
  MessagesModule,
  MessageModule,
  ToastModule,
  DialogModule,
  SidebarModule,
  BreadcrumbModule,
  AvatarModule,
  DividerModule,
  ChipModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...listModules
  ],
  exports:[
    ...listModules
  ]
})
export class PrimengModule { }
