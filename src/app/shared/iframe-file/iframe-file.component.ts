import { Component, Input, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-iframe-file',
  templateUrl: './iframe-file.component.html',
  styleUrls: ['./iframe-file.component.scss']
})
export class IframeFileComponent implements OnInit {

  @Input() fileURL:string;

  constructor(private spinner:NgxSpinnerService) {
  }

  ngOnInit(): void {
  }

  showSpinner(){
    this.spinner.show();
  }

  loadFile(){
    this.spinner.hide();
  }


}
