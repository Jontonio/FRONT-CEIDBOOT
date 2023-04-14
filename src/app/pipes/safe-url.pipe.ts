import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({
  name: 'safeUrl'
})
export class SafeUrlPipe implements PipeTransform {

  constructor(private sanitazer:DomSanitizer){}

  transform(url:string){
    let newURL = ''
    newURL = url?`${url.split('view')[0]}preview`:url;
    return this.sanitazer.bypassSecurityTrustResourceUrl(newURL);
  }

}
