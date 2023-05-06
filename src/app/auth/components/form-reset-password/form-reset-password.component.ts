import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataRecovery } from '../../class/global';

@Component({
  selector: 'app-form-reset-password',
  templateUrl: './form-reset-password.component.html',
  styleUrls: ['./form-reset-password.component.scss']
})
export class FormResetPasswordComponent implements OnInit {

  @Output() formData = new EventEmitter<DataRecovery>();
  @Input() loading:boolean;

  formReset:FormGroup;
  sendMessage:boolean;

  constructor(private readonly fb:FormBuilder) {
    this.inicializateVariables();
  }

  ngOnInit(): void {
    this.createFormReset();
  }

  inicializateVariables(){
    this.loading = false;
    this.sendMessage = false;
  }

  createFormReset(){
    this.formReset = this.fb.group({
      Email:[null, [Validators.required, Validators.email] ]
    })
  }

  /** setters */
  get Email(){
    return this.formReset.controls['Email'];
  }

  onReady(){
    /** verificar campos del formulario */
    if(this.formReset.invalid){
      Object.keys( this.formReset.controls ).forEach( label => this.formReset.controls[ label ].markAsDirty() )
      return;
    }
    /** emitar la data del formulario */
    this.loading = true;
    this.formData.emit(this.formReset.value);
  }

}
