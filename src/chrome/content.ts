import { ChromeMessage, SENDER } from "./types";

const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: any,
  response: any
) => {
  if (sender.id === chrome.runtime.id && message.from === SENDER.Background) {
    console.log("ContentINFO", message.message);
  }
  return true;
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
