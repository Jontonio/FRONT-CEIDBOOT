class PayloadBoot {
  message: Message;
  media: Media;
  link: Message;
  description_media:Description_media;
  constructor(message:Message, media:Media, link:Link, description_media:Description_media){
    this.message = message;
    this.media = media;
    this.link = link;
    this.description_media = description_media;
  }
}

class Media {
  stringValue: string;
  kind: string;
  constructor(stringValue:string, kind:string='stringValue'){
    this.kind = kind;
    this.stringValue = stringValue;
  }
}

class Message {
  stringValue: string;
  kind: string;
  constructor(stringValue:string, kind:string='stringValue'){
    this.kind = kind;
    this.stringValue = stringValue;
  }
}

class Type_media {
  stringValue: string;
  kind: string;
  constructor(stringValue:string, kind:string='stringValue'){
    this.kind = kind;
    this.stringValue = stringValue;
  }
}
class Description_media {
  stringValue: string;
  kind: string;
  constructor(stringValue:string, kind:string='stringValue'){
    this.kind = kind;
    this.stringValue = stringValue;
  }
}
class Link {
  stringValue: string;
  kind: string;
  constructor(stringValue:string, kind:string='stringValue'){
    this.kind = kind;
    this.stringValue = stringValue;
  }
}

export { PayloadBoot, Message, Media, Description_media, Link}
