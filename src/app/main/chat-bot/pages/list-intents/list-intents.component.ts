import { Component, OnInit } from '@angular/core';
import { ChabotService } from '../../services/chatbot.service';
import { Subscription } from 'rxjs';
import { Intent } from '../../class/Intent';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-intents',
  templateUrl: './list-intents.component.html',
  styleUrls: ['./list-intents.component.scss']
})
export class ListIntentsComponent implements OnInit {

  getListIntents$:Subscription;
  listIntents:Intent[];
  isLoading:boolean = false;

  constructor(private readonly _bot:ChabotService,
              private readonly route:Router) {
    this.getIntents();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if(this.getListIntents$) this.getListIntents$.unsubscribe();
  }

  getIntents(){
    this.isLoading = true;
    this.getListIntents$ = this._bot.getIntents().subscribe({
      next: (value) => {
        this.isLoading = false;
        if(value.ok){
          this.listIntents = value.data as Array<Intent>;
          console.log(this.listIntents)
        }
      },
      error: (e) => {
        this.isLoading = false;
        console.log(e)
      }
    })
  }

  moreInfoIntent(intent:Intent){
    const { name } = intent
    const splitName = name.split('/');
    const uuid  = splitName[splitName.length - 1];
    console.log(intent)
    this.route.navigate(['/system/chat-bot/intent', uuid])
  }

}
