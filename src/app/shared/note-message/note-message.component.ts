import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-note-message',
  templateUrl: './note-message.component.html',
  styleUrls: ['./note-message.component.scss']
})
export class NoteMessageComponent implements OnInit {

  @Input() msg:string = '';

  constructor() { }

  ngOnInit(): void {
  }

}
