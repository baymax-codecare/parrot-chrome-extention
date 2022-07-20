export enum SENDER {
  React,
  Content,
  Background,
}

export interface ChromeMessage {
  from: SENDER;
  message: any;
}
