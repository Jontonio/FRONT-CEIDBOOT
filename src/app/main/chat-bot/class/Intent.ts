class ResIntent{
  constructor(public msg:string, public ok:boolean, public data:Intent[] | Intent){}
}
class Intent {
  inputContextNames: any[];
  events: string[];
  trainingPhrases: any[];
  outputContexts: any[];
  parameters: any[];
  messages: Message[];
  defaultResponsePlatforms: any[];
  followupIntentInfo: any[];
  name: string;
  displayName: string;
  priority: number;
  isFallback: boolean;
  webhookState: string;
  action: string;
  resetContexts: boolean;
  rootFollowupIntentName: string;
  parentFollowupIntentName: string;
  mlDisabled: boolean;
  liveAgentHandoff: boolean;
  endInteraction: boolean;
}

interface Message {
  platform: string;
  text?: Text;
  message: string;
  payload?: Payload;
}

interface Payload {
  fields: Fields;
}

interface Fields {
  media: Media;
  description_media: Media;
  name_media: Media;
  link: Media;
  message: Media;
  type_media: Media;
}

interface Media {
  stringValue: string;
  kind: string;
}

interface Text {
  text: string[];
}

interface Phrase {
  response: string;
}

export { ResIntent, Intent, Phrase}
