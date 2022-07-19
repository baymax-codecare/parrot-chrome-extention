import { useLocation } from "react-router-dom";
import { Header } from "../Elements/Header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  console.log(location);
  return <div className="flex flex-col">
    <Header />
    {children}
  </div>
}