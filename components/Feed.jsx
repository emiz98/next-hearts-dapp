import { ChevronDownIcon, SearchIcon } from '@heroicons/react/outline'
import { useEffect, useState } from 'react'
import FundingEvent from './FundingEvent'
import { findById } from '../utils/utils'

const Feed = ({ data, donateToEvent, contributors }) => {
  const [loadMore, setLoadMore] = useState(false)
  const [searchResults, setSearchResults] = useState(data)
  const [searchInput, setSearchInput] = useState('')
  const [showAmount, setShowAmount] = useState(6)

  useEffect(() => {
    search(searchInput)
  }, [searchInput])

  const moreEvents = () => {
    setLoadMore(true)
    setTimeout(() => {
      if (showAmount + 3 <= data.length) {
        setShowAmount(showAmount + 3)
      } else {
        setShowAmount(data.length)
      }

      setLoadMore(false)
    }, 1500)
  }

  const search = (title) => {
    let filteredRes = data.filter((item) =>
      item.title.toLowerCase().includes(title)
    )
    setSearchResults(filteredRes)
  }

  return (
    <div className="my-20 mx-auto max-w-screen-xl px-5 xl:px-0">
      <div
        className="mb-10 flex flex-col items-start justify-between space-y-5
       text-white md:flex-row md:items-end"
      >
        <h1 className="text-4xl font-bold md:text-6xl">Fundraisers</h1>
        <div
          className="flex w-full items-center rounded-lg border-2 border-white px-4 
        md:w-1/3 lg:max-w-screen-sm"
        >
          <SearchIcon className="w-6" />
          <input
            className="bg-transparent px-3 py-2 outline-none"
            type="text"
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search event, description..."
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 lg:grid-cols-3">
        {searchInput == ''
          ? data
              .slice(0, showAmount)
              .map(
                (
                  {
                    author,
                    description,
                    id,
                    imageHash,
                    goalAmount,
                    tipAmount,
                    title,
                  },
                  index
                ) => (
                  <FundingEvent
                    key={id}
                    index={index}
                    author={author}
                    description={description}
                    id={id}
                    imageHash={imageHash}
                    goalAmount={goalAmount}
                    tipAmount={tipAmount}
                    title={title}
                    contributors={findById(contributors, id)}
                    donateToEvent={donateToEvent}
                  />
                )
              )
          : searchResults
              .slice(0, showAmount)
              .map(
                (
                  {
                    author,
                    description,
                    id,
                    imageHash,
                    goalAmount,
                    tipAmount,
                    title,
                  },
                  index
                ) => (
                  <FundingEvent
                    key={id}
                    index={index}
                    author={author}
                    description={description}
                    id={id}
                    imageHash={imageHash}
                    goalAmount={goalAmount}
                    tipAmount={tipAmount}
                    title={title}
                    contributors={findById(contributors, id)}
                    donateToEvent={donateToEvent}
                  />
                )
              )}
      </div>
      {data.length > showAmount && (
        <div
          onClick={() => moreEvents()}
          className="group mx-auto mt-10 flex w-40 cursor-pointer items-center 
      justify-center space-x-2 rounded-lg border-2 border-white px-4 py-2
      text-white transition ease-in-out hover:bg-white hover:text-black"
        >
          {loadMore ? (
            <>
              <span className="font-medium">Loading</span>
              <div className="flex items-center justify-center">
                <svg
                  role="status"
                  className="mr-2 inline h-5 w-5 animate-spin fill-white text-gray-100 group-hover:fill-black dark:text-gray-500"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            </>
          ) : (
            <>
              <span className="font-medium">Load More</span>
              <ChevronDownIcon className="w-6" />
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default Feed
