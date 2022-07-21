import { Header } from "../Views/Header";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout = ({ children }: MainLayoutProps) => {
  return <div className="flex flex-col h-full">
    <Header />
    {children}
  </div>
}