import React from 'react'

const Footer = () => {
  return (
    <div className=" border-t border-gray-800 bg-[#191919] px-5 pt-10 xl:px-0">
      <div className="mx-auto max-w-screen-xl text-white">
        <div className="grid grid-cols-1 space-y-5 md:grid-cols-2 md:space-y-0">
          <div className="">
            <img className="mb-2 w-28" src="logo.png" alt="logo" />
            <p className="mb-3 w-full text-sm md:w-2/3">
              Our aim is to to provide timely, appropiate and the best possible
              care to all children in Sri Lanka.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-x-5">
            <div className="footerContent">
              <h4 className="text-lg font-medium">Home</h4>
              <span>Milestones</span>
              <span>Why support little hearts</span>
              <span>Little hearts theme song</span>
              <span>Sponsors</span>
            </div>
            <div className="footerContent">
              <h4 className="text-lg font-medium">About</h4>
              <span>Little hearts</span>
              <span>Critical care complex</span>
              <span>Project legitimacy</span>
              <span>Contact us</span>
            </div>
            <div className="footerContent">
              <h4 className="text-lg font-medium">Stories</h4>
              <span>Stories</span>
              <span>Galleries</span>
            </div>
          </div>
        </div>
        <div className="mt-20 pb-5 text-center">
          <h5 className="font-medium">Little Hearts Decentralized</h5>
          <p className="text-sm text-gray-300">
            This app is build only for educational purposes only
          </p>
        </div>
      </div>
    </div>
  )
}

export default Footer
