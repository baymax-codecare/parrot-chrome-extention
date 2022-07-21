import logo from '@/assets/images/logo.png'
import { MenuIcon } from '@heroicons/react/outline'
import { HomeIcon } from '@heroicons/react/solid'
import { useLocation, useNavigate } from 'react-router-dom'

export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const MenuButton = () => {
    if (location.pathname === '/notifications') {
      return <button type="button" onClick={() => navigate('/sniper')} className="border border-transparent bg-transparent">
        <HomeIcon className='w-8 h-8 text-teal-800 fill-current' />
      </button>
    } else {
      return (<button type="button" onClick={() => navigate('/notifications')} className="border border-transparent bg-transparent">
        <MenuIcon className='w-8 h-8 text-teal-800 fill-current' />
      </button>)
    }
  }

  return <div className="flex items-center justify-between p-2">
    <MenuButton />
    <img src={logo} alt="Parrot logo" className='w-16' />
  </div >
}