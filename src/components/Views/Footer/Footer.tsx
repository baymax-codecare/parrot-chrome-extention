import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom"

export const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return <div className="flex w-full flex-row">
    <button
      onClick={() => navigate('/sniper')}
      type="button" className={clsx(
        {
          " border border-teal-800 flex-1 py-2": true,
          'bg-teal-800 text-white': location.pathname === '/sniper',
          'bg-white text-teal-800': location.pathname !== '/sniper',
        }
      )}>
      Sniper
    </button>
    <button type="button"
      onClick={() => navigate('/trait-pricing')}
      className={clsx(
        {
          "border border-teal-800 flex-1 py-2": true,
          'bg-teal-800 text-white': location.pathname === '/trait-pricing',
          'bg-white text-teal-800': location.pathname !== '/trait-pricing',
        }
      )}>
      Trait Pricing
    </button>
  </div>
}