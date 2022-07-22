import { ChromeMessage, SENDER } from "./types";

export const executeContentScript = async (tabId: number) => {
  await chrome.scripting.executeScript({
    target: { tabId: tabId, allFrames: true },
    files: ["static/js/content.js"],
  });
};

export const getCurrentTabUrl = (): Promise<string | undefined> => {
  return new Promise<string | undefined>((resolve) => {
    const queryInfo = { active: true, lastFocusedWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        resolve(tabs[0].url);
      });
  });
};

export const getCurrentTabUId = (): Promise<number | undefined> => {
  return new Promise<number | undefined>((resolve) => {
    const queryInfo = { active: true, currentWindow: true };

    chrome.tabs &&
      chrome.tabs.query(queryInfo, (tabs) => {
        resolve(tabs[0].id);
      });
  });
};

/**
 * @description send collection info message from background to content
 * @param
 */
export const sendCollectionInfoMessage = async ({
  tabId,
  collectionSymbol,
  traits,
}: {
  tabId: number;
  collectionSymbol: string;
  traits?: string;
}) => {
  const message: ChromeMessage = {
    from: SENDER.Background,
    message: JSON.stringify({
      collectionSymbol,
      traits,
    }),
  };

  await chrome.tabs.sendMessage(tabId, message);
};
