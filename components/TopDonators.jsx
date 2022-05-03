import { ArrowNarrowRightIcon } from '@heroicons/react/solid'
import Donator from './Donator'

const TopDonators = ({ contributorData }) => {
  return (
    <div className="mx-auto my-20 max-w-screen-xl px-5 text-white xl:px-0">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-4xl font-bold lg:text-6xl">Top Donators</h1>
        <div className="group flex cursor-pointer items-center space-x-2">
          <h4 className="group-hover:underline">View All</h4>
          <ArrowNarrowRightIcon className="h-5 w-5" />
        </div>
      </div>

      <div
        className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2 md:grid-cols-3
       lg:grid-cols-4 xl:grid-cols-5"
      >
        {[...contributorData]
          .reverse()
          .slice(0, 9)
          .map(({ contributor, id }, i) => (
            <Donator key={id} hash={contributor} i={i} />
          ))}
      </div>
    </div>
  )
}

export default TopDonators
