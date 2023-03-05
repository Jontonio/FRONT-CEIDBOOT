import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-loadding',
  templateUrl: './loadding.component.html',
  styleUrls: ['./loadding.component.scss']
})
export class LoaddingComponent implements OnInit {

  @Input() msg:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
