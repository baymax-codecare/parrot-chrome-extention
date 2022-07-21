export enum SENDER {
  React,
  Content,
  Background,
}

export interface ChromeMessage {
  from: SENDER;
  type?: string;
  message?: any;
}
