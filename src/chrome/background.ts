import { MESSAGE_REQUEST_COLLECTION_INFO, MESSAGE_URL_UPDATED } from "./consts";
import { getAllInfo } from "./magic-eden";
import { getCurrentTabUrl } from "./utils";
import { ChromeMessage, SENDER } from "./types";

export {};
/** Fired when the extension is first installed,
 *  when the extension is updated to a new version,
 *  and when Chrome is updated to a new version. */
chrome.runtime.onInstalled.addListener((details) => {});

chrome.runtime.onConnect.addListener((port) => {});

chrome.runtime.onStartup.addListener(() => {});

/**
 *  Sent to the event page just before it is unloaded.
 *  This gives the extension opportunity to do some clean up.
 *  Note that since the page is unloading,
 *  any asynchronous operations started while handling this event
 *  are not guaranteed to complete.
 *  If more activity for the event page occurs before it gets
 *  unloaded the onSuspendCanceled event will
 *  be sent and the page won't be unloaded. */
chrome.runtime.onSuspend.addListener(() => {});

chrome.tabs.onActivated.addListener(async function (activeInfo) {});

chrome.tabs.onUpdated.addListener(async function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    getCurrentTabUrl().then((url) => {
      if (!url) return;
      const collectionInfo = getAllInfo(url);
      if (!collectionInfo) return;
      chrome.runtime.sendMessage({
        from: SENDER.Background,
        type: MESSAGE_URL_UPDATED,
        message: url,
      });
    });
  }
  return true;
});

/**
 * @description Handles the message from react app
 * @param message
 * @param sender
 * @param response
 * @returns
 */
const messagesFromReactAppListener = (
  message: ChromeMessage,
  sender: any,
  sendResponse: any
) => {
  // if request collection info
  if (
    sender.id === chrome.runtime.id &&
    message.from === SENDER.React &&
    message.type === MESSAGE_REQUEST_COLLECTION_INFO
  ) {
    getCurrentTabUrl().then((url) => {
      if (!url) return;
      const collectionInfo = getAllInfo(url);
      if (!collectionInfo) return;
      sendResponse(collectionInfo);
    });
  }

  return true;
};

/**
 * Fired when a message is sent from either an extension process or a content script.
 */
chrome.runtime.onMessage.addListener(messagesFromReactAppListener);
