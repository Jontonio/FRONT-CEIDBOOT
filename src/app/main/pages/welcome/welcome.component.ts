import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  randNum:number = 0;

  constructor() { }

  ngOnInit(): void {
    this.randNum = this.randomRumber(3, 1);
  }

  randomRumber(max:number, min:number){
    return Math.floor(Math.random() *(max  - min) + min);
  }

}
