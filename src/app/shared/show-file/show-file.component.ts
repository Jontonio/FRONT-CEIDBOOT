import { Component, OnInit, Input } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-show-file',
  templateUrl: './show-file.component.html',
  styleUrls: ['./show-file.component.scss']
})
export class ShowFileComponent implements OnInit {

  @Input() fileURL:string;
  displayFile:boolean = false;

  constructor(private readonly spinner:NgxSpinnerService) { }

  ngOnInit(): void {}

  showSpinner(){
    this.spinner.show();
  }

  loadFile(){
    this.spinner.hide();
  }

  showModal(){
    this.displayFile = true;
  }

  closeModal(){
    this.displayFile = false;
  }

}
