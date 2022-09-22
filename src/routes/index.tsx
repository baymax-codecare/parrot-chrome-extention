import storage from "@/chrome/chrome-storage";
import {
  MESSAGE_GET_REFRESH_INTERVAL,
  MESSAGE_REQUEST_COLLECTION_INFO,
  MESSAGE_SET_FP_NOTIFICATIONS,
  MESSAGE_SET_LISTING_NOTIFICATIONS,
  MESSAGE_URL_UPDATED,
} from "@/chrome/consts";
import { HyperSpaceCollection } from "@/chrome/hyperspace";
import { ChromeMessage, SENDER } from "@/chrome/types";
import { MainLayout } from "@/components/Layouts";
import { Notifications } from "@/pages/Notifications";
import { Sniper } from "@/pages/Sniper";
import { TraitPricing } from "@/pages/TraitPricing";
import { sendNotificationsRequest } from "@/services/server";
import {
  setCollectionSymbol,
  setCollectionTraits,
  setRefreshInterval,
} from "@/slices/chrome";
import { useAppDispatch, useAppSelector } from "@/stores/hook";
import { useEffect } from "react";
import { Navigate, Outlet, useRoutes } from "react-router-dom";

const App = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

export const AppRoutes = () => {
  const dispatch = useAppDispatch();

  const listingNotifications = useAppSelector(
    (state) => state.notification.listingNotifications
  );
  const fpNotifications = useAppSelector(
    (state) => state.notification.floorPriceNotifications
  );

  /**
   * @description Message listener from background.js
   * @param message
   * @param sender
   * @param sendResponse
   */
  const messageFromBackgroundListener = (
    message: ChromeMessage,
    sender: any,
    sendResponse: any
  ) => {
    // If url of tabs are updated
    if (
      sender.id === chrome.runtime.id &&
      message.from === SENDER.Background &&
      message.type === MESSAGE_URL_UPDATED
    ) {
      requestCollectionInfo();
    }
  };

  useEffect(() => {
    chrome.runtime.sendMessage({
      from: SENDER.React,
      type: MESSAGE_SET_LISTING_NOTIFICATIONS,
      message: JSON.stringify(listingNotifications),
    });

    chrome.runtime.sendMessage({
      from: SENDER.React,
      type: MESSAGE_SET_FP_NOTIFICATIONS,
      message: JSON.stringify(fpNotifications),
    });

    sendNotificationList();
  }, [listingNotifications, fpNotifications]);

  /**
   * Send message to background.js to get CollectionSymbol & Traits
   */
  async function requestCollectionInfo() {
    const message: ChromeMessage = {
      from: SENDER.React,
      type: MESSAGE_REQUEST_COLLECTION_INFO,
    };

    await chrome.runtime.sendMessage(
      message,
      (response: HyperSpaceCollection) => {
        dispatch(setCollectionSymbol(response.project_id));
        dispatch(setCollectionTraits(response.attributes));
      }
    );
  }

  async function sendNotificationList() {
    const listing = await storage.getListingNotifications();
    const fp = await storage.getFPNotifications();

    if (
      listing === JSON.stringify(listingNotifications) &&
      fp === JSON.stringify(fpNotifications)
    )
      return;

    await storage.setListingNotifications(JSON.stringify(listingNotifications));
    await storage.setFPNotifications(JSON.stringify(fpNotifications));

    await sendNotificationsRequest({
      data: {
        listingNotifications,
        fpNotifications,
      },
    });
  }

  /**
   * @description Send message to get stored refresh interval
   */
  async function requestRefreshInterval() {
    const message: ChromeMessage = {
      from: SENDER.React,
      type: MESSAGE_GET_REFRESH_INTERVAL,
    };

    await chrome.runtime.sendMessage(message, (refreshInterval) => {
      dispatch(setRefreshInterval(refreshInterval));
    });
  }

  /**
   * Attach Message Listener
   */
  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageFromBackgroundListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageFromBackgroundListener);
    };
  }, []);

  // Fetch collection info
  useEffect(() => {
    requestCollectionInfo();
    requestRefreshInterval();
  });

  const commonRoutes = [
    { path: "/", element: <Navigate to="/sniper" /> },
    {
      path: "/",
      element: <App />,
      children: [
        { path: "/notifications", element: <Notifications /> },
        { path: "/sniper", element: <Sniper /> },
        { path: "/trait-pricing", element: <TraitPricing /> },
        { path: "*", element: <Navigate to="/notifications" /> },
      ],
    },
    { path: "*", element: <Navigate to="/notifications" /> },
  ];

  const element = useRoutes([...commonRoutes]);
  return <>{element}</>;
};
