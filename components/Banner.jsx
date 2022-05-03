import { VolumeOffIcon, VolumeUpIcon } from '@heroicons/react/outline'
import {
  ChevronDoubleDownIcon,
  PlayIcon,
  StopIcon,
} from '@heroicons/react/solid'
import { useEffect, useRef, useState } from 'react'

const Banner = () => {
  const vidRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll)
    return () => window.removeEventListener('scroll', listenToScroll)
  }, [])

  const listenToScroll = () => {
    if (window.scrollY > 400) {
      setMuted(true)
      setIsScrolled(true)
    } else if (window.scrollY > 100) {
      setMuted(false)
      setIsScrolled(false)
    }
  }

  const handleVideo = () => {
    if (isPlaying) {
      vidRef.current.pause()
      setIsPlaying(false)
    } else {
      setIsPlaying(true)
      vidRef.current.play()
    }
  }

  return (
    <div className="relative h-screen w-full overflow-hidden text-white">
      <video
        className={`h-[120%] ${!isPlaying && 'hidden'} max-w-none`}
        style={{
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          left: '50%',
          top: '50%',
          zIndex: '5',
        }}
        src="trailer.mp4"
        loop
        muted={muted}
        ref={vidRef}
      ></video>
      <div
        className="absolute bottom-5 z-20 h-56 w-full bg-gradient-to-t
      from-black to-transparent md:bottom-0"
      ></div>
      <div
        className="absolute bottom-0 top-0 left-5 right-0 z-20 mx-auto
      flex w-full items-center md:left-10 md:max-w-screen-xl"
      >
        <div className="flex flex-col space-y-5 md:w-2/3">
          <h1 className="text-5xl font-bold lg:text-7xl">
            Building a better tomorrow
          </h1>
          <p className="w-5/6 text-sm text-gray-300 md:text-lg">
            Our aim is to to provide timely, appropiate and the best possible
            care to all children in Sri Lanka in aid of children with heart
            diseases & critical illnesses. 100% goes to saving lives.
          </p>

          <div
            onClick={() => handleVideo()}
            className="group flex cursor-pointer select-none items-center
        space-x-2 text-gray-200 transition ease-in-out hover:text-white"
          >
            {isPlaying ? (
              <>
                <StopIcon className="w-12" />
                <span className="group-hover:underline">Stop trailer</span>
              </>
            ) : (
              <>
                <PlayIcon className="w-12" />
                <span className="group-hover:underline">Play trailer</span>
              </>
            )}
          </div>
        </div>
        {!isPlaying && (
          <img
            className="absolute -z-10 w-11/12 object-contain md:static md:inline-flex md:w-1/4"
            src="landing1.jpeg"
            alt="landing1"
          />
        )}
      </div>
      {isPlaying && (
        <div
          onClick={() => setMuted(!muted)}
          className="absolute top-28 right-5 z-30 cursor-pointer rounded-full border-2 
          border-white p-2 transition ease-in-out hover:bg-white hover:text-black
          md:top-28 md:right-10"
        >
          {muted ? (
            <VolumeOffIcon className="w-8" />
          ) : (
            <VolumeUpIcon className="w-8" />
          )}
        </div>
      )}
      {!isScrolled && (
        <ChevronDoubleDownIcon
          className="absolute left-0 right-0 bottom-20 
      z-30 mx-auto w-10 animate-bounce"
        />
      )}
    </div>
  )
}

export default Banner
