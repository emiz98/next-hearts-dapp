import { useState } from 'react'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { goalPercentage } from '../utils/utils'
import { motion } from 'framer-motion'

const FundingEvent = ({
  author,
  description,
  id,
  imageHash,
  goalAmount,
  tipAmount,
  title,
  contributors,
  donateToEvent,
  index,
}) => {
  const [inputAmount, setInputAmount] = useState(0.1)

  const donate = () => {
    if (inputAmount < 0.01) {
      alert('Please enter value larger that 0.1')
      return
    }
    donateToEvent(id, parseFloat(inputAmount).toFixed(3))
  }
  return (
    <motion.div
      initial={{ x: 50, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          delay: index * 0.2,
          duration: 0.3,
        },
      }}
      exit={{
        x: 100,
        opacity: 0,
      }}
      className="grid grid-cols-1 space-y-4 rounded-xl border-2 border-white p-4 text-white"
    >
      <img
        className="h-48 w-full rounded-lg object-cover grayscale"
        src={`https://ipfs.infura.io/ipfs/${imageHash}`}
        alt="fund"
      />
      <div className="flex flex-grow flex-col">
        <div className="flex flex-col">
          <h3 className="mb-2 text-2xl font-bold uppercase line-clamp-2">
            {/* Give us only 1 day */}
            {title}
          </h3>
          <p className="font-light text-gray-400 line-clamp-3">
            {/* Whether you are a junior employee or a CEO come together as one
          company to save our lives by donating a day's salary, just this
          once... */}
            {description}
          </p>
        </div>
        <div className="flex flex-grow items-center justify-between pt-5">
          <div className="group space-y-1">
            {contributors.length > 0 && (
              <>
                <span className="cursor-pointer text-xs text-gray-300 group-hover:underline">
                  {contributors.length} Contributors
                </span>
                <div className="flex items-center">
                  {contributors.slice(0, 3).map(({ contributor }, i) => (
                    <motion.div
                      key={i}
                      initial={{ x: 50, opacity: 0 }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        transition: {
                          delay: 0.1,
                          duration: 0.7,
                        },
                      }}
                      exit={{
                        x: 100,
                        opacity: 0,
                      }}
                      className={`mr-1`}
                    >
                      <Jazzicon
                        diameter={20}
                        seed={jsNumberForAddress(contributor)}
                      />
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-y-2 md:flex-row md:gap-x-2">
            <div className="flex items-center gap-x-2">
              <img className="w-3" src="eth.png" alt="eth" />
              <span className="text-sm">+</span>
              <input
                className="w-12 bg-transparent outline-none"
                type="number"
                min={0.1}
                defaultValue={inputAmount}
                onChange={(e) => setInputAmount(e.target.value)}
                step={0.01}
              />
            </div>
            <button
              onClick={donate}
              className="rounded-full bg-gradient-to-r from-red-600 
          to-red-500 px-8 py-2 font-medium hover:from-red-500"
            >
              Donate
            </button>
          </div>
        </div>
        <div className="mt-8 flex items-center space-x-4">
          <div className="h-4 w-full rounded-full bg-gray-200">
            <div
              className={`h-4 w-[${goalPercentage(
                tipAmount,
                goalAmount
              ).toString()}%] rounded-full bg-gradient-to-r 
          from-red-600 to-red-400`}
            ></div>
          </div>
          <div className="flex items-center gap-x-2">
            <img className="w-5" src="eth.png" alt="eth" />
            <span className="mr-5 whitespace-nowrap text-sm">
              {parseInt(web3.utils.fromWei(tipAmount, 'Ether'))}/
              {parseInt(web3.utils.fromWei(goalAmount, 'Ether'))} Raised
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default FundingEvent
