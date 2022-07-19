import { MainLayout } from "@/components/Layouts"
import { Notifications } from "@/pages/Notifications"
import { Sniper } from "@/pages/Sniper"
import { TraitPricing } from "@/pages/TraitPricing"
import { Navigate, Outlet, useRoutes } from "react-router-dom"

const App = () => {
  return <MainLayout>
    <Outlet />
  </MainLayout>
}

export const AppRoutes = () => {
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