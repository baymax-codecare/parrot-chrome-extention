import logo from '@/assets/images/logo.png'
import { MenuIcon } from '@heroicons/react/outline'

export const Header = () => {
  return <div className="flex items-center justify-between p-2">
    <button type="button" className="border border-transparent bg-transparent">
      <MenuIcon className='w-8 h-8 text-teal-800 fill-current' />
    </button>
    <img src={logo} alt="Parrot logo" className='w-16' />
  </div>
}