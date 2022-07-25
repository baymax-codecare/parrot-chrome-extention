import { MESSAGE_REQUEST_COLLECTION_INFO, MESSAGE_URL_UPDATED } from "@/chrome/consts"
import { ChromeMessage, SENDER } from "@/chrome/types"
import { MainLayout } from "@/components/Layouts"
import { Notifications } from "@/pages/Notifications"
import { Sniper } from "@/pages/Sniper"
import { TraitPricing } from "@/pages/TraitPricing"
import { setCollectionSymbol, setCollectionTraits } from "@/slices/chrome"
import { useAppDispatch } from "@/stores/hook"
import { useEffect } from "react"
import { Navigate, Outlet, useRoutes } from "react-router-dom"

const App = () => {
  return <MainLayout>
    <Outlet />
  </MainLayout>
}

export const AppRoutes = () => {
  const dispatch = useAppDispatch();

  /**
   * @description Message listener from background.js
   * @param message 
   * @param sender 
   * @param sendResponse 
   */
  const messageFromBackgroundListener = (message: ChromeMessage,
    sender: any,
    sendResponse: any) => {

    // If url of tabs are updated
    if (
      sender.id === chrome.runtime.id &&
      message.from === SENDER.Background &&
      message.type === MESSAGE_URL_UPDATED
    ) {
      requestCollectionInfo()
    }
  }

  /**
   * Send message to background.js to get CollectionSymbol & Traits
   */
  async function requestCollectionInfo() {
    const message: ChromeMessage = {
      from: SENDER.React,
      type: MESSAGE_REQUEST_COLLECTION_INFO,
    }

    await chrome.runtime.sendMessage(
      message, (response) => {
        dispatch(
          setCollectionSymbol(response.collectionSymbol)
        )
        dispatch(
          setCollectionTraits(response.traits)
        )
      }
    );
  }

  /**
   * Attach Message Listener 
   */
  useEffect(() => {
    chrome.runtime.onMessage.addListener(messageFromBackgroundListener)
    return () => {
      chrome.runtime.onMessage.removeListener(messageFromBackgroundListener)
    }
  }, [])


  // Fetch collection info
  useEffect(() => {
    requestCollectionInfo();
  })

  const commonRoutes = [
    { path: '/', element: <Navigate to="/sniper" /> },
    {
      path: '/',
      element: <App />,
      children: [
        { path: '/notifications', element: <Notifications /> },
        { path: '/sniper', element: <Sniper /> },
        { path: '/trait-pricing', element: <TraitPricing /> },
        { path: '*', element: <Navigate to="/notifications" /> }
      ]
    },
    { path: '*', element: <Navigate to="/notifications" /> }
  ]

  const element = useRoutes([...commonRoutes]);
  return <>{element}</>
}