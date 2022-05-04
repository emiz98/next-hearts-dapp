import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { username } from '../utils/utils'

const Donator = ({ contributor, i }) => {
  return (
    <div
      className="flex cursor-pointer items-center space-x-4 rounded-lg
     border-2 border-white bg-gray-900 px-4 py-2 hover:bg-gray-800"
    >
      <span className="mr-5 text-3xl font-medium"># {i + 1}</span>
      <Jazzicon
        diameter={40}
        seed={jsNumberForAddress(contributor[0].contributor)}
      />
      <h4>{username(contributor[0].contributor)}</h4>
    </div>
  )
}

export default Donator
