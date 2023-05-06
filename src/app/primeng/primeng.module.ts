import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * List of modules of primeng
*/
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TagModule } from 'primeng/tag';
import { MenubarModule } from 'primeng/menubar';
import { ButtonModule } from 'primeng/button';
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
import { AvatarModule } from 'primeng/avatar';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { MegaMenuModule } from 'primeng/megamenu';
import { ToolbarModule } from 'primeng/toolbar';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { PaginatorModule } from 'primeng/paginator';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { BadgeModule } from 'primeng/badge';
import { SkeletonModule } from 'primeng/skeleton';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';
import { TabMenuModule } from 'primeng/tabmenu';
import { KnobModule } from 'primeng/knob';
import { TooltipModule } from 'primeng/tooltip';
import { CheckboxModule } from 'primeng/checkbox';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PanelModule } from 'primeng/panel';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputMaskModule } from 'primeng/inputmask';
import { AccordionModule } from 'primeng/accordion';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditorModule } from 'primeng/editor';
import { TimelineModule } from 'primeng/timeline';

/**
 * array of modules
 */
const listModules:any[] = [
  MenubarModule,
  ButtonModule,
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
  AvatarModule,
  DividerModule,
  ChipModule,
  MegaMenuModule,
  ToolbarModule,
  TableModule,
  DropdownModule,
  PaginatorModule,
  InputTextareaModule,
  AvatarGroupModule,
  BadgeModule,
  TagModule,
  SkeletonModule,
  ConfirmDialogModule,
  CalendarModule,
  InputNumberModule,
  TabMenuModule,
  KnobModule,
  TooltipModule,
  CheckboxModule,
  PanelModule,
  SplitButtonModule,
  ProgressBarModule,
  RadioButtonModule,
  InputMaskModule,
  AccordionModule,
  OverlayPanelModule,
  EditorModule,
  TimelineModule
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
