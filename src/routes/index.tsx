import { MESSAGE_REQUEST_COLLECTION_INFO } from "@/chrome/consts"
import { ChromeMessage, SENDER } from "@/chrome/types"
import { getCurrentTabUId } from "@/chrome/utils"
import { MainLayout } from "@/components/Layouts"
import { Notifications } from "@/pages/Notifications"
import { Sniper } from "@/pages/Sniper"
import { TraitPricing } from "@/pages/TraitPricing"
import { setCollectionSymbol } from "@/slices/chrome"
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

  useEffect(() => {
    async function requestCollectionInfo() {
      const message: ChromeMessage = {
        from: SENDER.React,
        message: MESSAGE_REQUEST_COLLECTION_INFO,
      }

      const tabId = await getCurrentTabUId();
      if (!tabId) return;
      await chrome.runtime.sendMessage(
        message, (response) => {
          dispatch(setCollectionSymbol(response.collectionSymbol))
        }
      );
    }

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