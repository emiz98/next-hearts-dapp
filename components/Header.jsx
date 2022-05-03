import { username } from '../utils/utils'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'

const Header = ({ account, setModal }) => {
  return (
    <div className="fixed top-0 z-50 w-full bg-[#191919] py-5 px-5 xl:px-0">
      <div className="mx-auto flex max-w-screen-xl items-center justify-between">
        <img
          className="w-32 object-contain md:w-40"
          src="logo.png"
          alt="logo"
        />

        {account && (
          <div className="flex items-center md:space-x-5">
            <button
              onClick={() => setModal(true)}
              className="hidden rounded-full border-2 border-red-600 px-4 py-2 font-medium text-white 
             transition ease-out hover:bg-red-600 hover:text-white md:inline-flex"
            >
              Create a Fundraiser
            </button>
            <div
              className="flex cursor-pointer items-center 
        rounded-full border-2 border-white bg-gray-800 
        p-1 transition ease-in-out hover:bg-gray-700"
            >
              <Jazzicon diameter={30} seed={jsNumberForAddress(account)} />
              <span className="px-3 py-1 text-sm text-white md:px-4">
                {username(account)}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Header
