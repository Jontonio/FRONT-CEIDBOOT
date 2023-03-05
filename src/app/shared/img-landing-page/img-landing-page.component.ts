import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-img-landing-page',
  templateUrl: './img-landing-page.component.html',
  styleUrls: ['./img-landing-page.component.scss']
})
export class ImgLandingPageComponent implements OnInit {

  @Input() url:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
