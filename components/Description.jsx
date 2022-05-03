import { HeartIcon } from '@heroicons/react/solid'

const Description = () => {
  return (
    <div className="mx-auto mt-20 mb-40 flex max-w-screen-xl justify-between px-5 pt-20 xl:px-0">
      <div className="flex w-full flex-col text-white md:w-3/5">
        <div className="flex items-center gap-x-3">
          <HeartIcon className="w-32 text-red-600 md:w-48" />
          <h1 className="w-2/3 text-4xl font-bold md:text-6xl">
            Why Little Hearts?
          </h1>
        </div>
        <div className="ml-3 mt-12 flex flex-col">
          <h4 className="text-xl font-bold">
            3000+ babies are born with heart diseases each year in Sri Lanka.
          </h4>
          <p className="text-gray-300">
            That’s almost 8 in 1000 babies per year. More than 40% of these
            babies and children, and over 60% of critically ill babies and
            children cannot get treatment on time because of a lack of
            facilities.
          </p>
          <h4 className="mt-10 text-xl font-bold">
            1500+ children die due to this lack of facilities. We’re trying to
            change that.
          </h4>
          <p className="text-gray-300">
            Join us in our quest to save them. Become a superhero that saves our
            little hearts.
          </p>
        </div>
      </div>
      <img
        className="hidden object-contain md:static md:inline-flex md:w-2/5"
        src="landing2.png"
        alt="landing2"
      />
    </div>
  )
}

export default Description
