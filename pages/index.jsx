import Head from 'next/head'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import Donation from '../abis/Donation.json'
import Header from '../components/Header'
import Banner from '../components/Banner'
import Feed from '../components/Feed'
import Description from '../components/Description'
import TopDonators from '../components/TopDonators'
import Footer from '../components/Footer'
import { AnimatePresence, motion } from 'framer-motion'
import { PlusIcon, XIcon } from '@heroicons/react/solid'
import { CameraIcon } from '@heroicons/react/outline'

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
})

const Home = () => {
  const [account, setAccount] = useState('')
  const [modal, setModal] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [loadingMetamask, setLoadingMetamask] = useState(false)
  const [inputs, setInputs] = useState({
    image: null,
    title: '',
    description: '',
    goal: 0,
  })
  const [donationContract, setDonationContract] = useState(null)
  const [eventData, setEventData] = useState([])
  const [contributorData, setContributorData] = useState([])

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should install MetaMask!'
      )
    }
  }

  const loadBlockchainData = async () => {
    const web3 = window.web3
    const accounts = await web3.eth.getAccounts() //Load accounts
    setAccount(accounts[0])
    const networkId = await web3.eth.net.getId() //Get network
    const networkData = Donation.networks[networkId] //Get network data
    //Check if net data exists, then
    if (networkData) {
      const donation = new web3.eth.Contract(Donation.abi, networkData.address)
      setDonationContract(donation)

      const count = await donation.methods.eventCount().call() //Get the event count
      const count2 = await donation.methods.contributorCount().call() //Get the event count

      let tempEvents = []
      for (let i = 1; i < parseInt(count) + 1; i++) {
        const event = await donation.methods.events(i).call()
        let obj = {
          id: event.id,
          title: event.title,
          description: event.description,
          imageHash: event.hash,
          author: event.author,
          goalAmount: event.goalAmount,
          tipAmount: event.tipAmount,
        }
        tempEvents.push(obj)
      }
      setEventData(tempEvents)

      let tempContributors = []
      for (let i = 1; i < parseInt(count2) + 1; i++) {
        const contributor = await donation.methods.contributors(i).call()
        let obj = {
          id: contributor.id,
          eventId: contributor.eventId,
          contributor: contributor.contributor,
          donatedAmount: contributor.donatedTip,
        }
        tempContributors.push(obj)
      }
      setContributorData(tempContributors)

      setLoading(false)
    } else {
      window.alert(
        'Contract not deployed to detected network! (Please change to ropsten test net!)'
      )
    }
  }

  const captureImage = (event) => {
    event.preventDefault()
    const file = event.target.files[0]
    const reader = new window.FileReader()
    reader.readAsArrayBuffer(file)

    reader.onloadend = () => {
      setInputs({ ...inputs, image: Buffer(reader.result) })
    }
  }

  const sendToBlockchain = () => {
    console.log('Started submitting to IPFS')
    setUploading(true)

    ipfs.add(inputs.image, (error, result) => {
      if (error) {
        console.log(error)
        setUploading(false)
        setModal(false)
        return
      }
      setLoadingMetamask(true)

      //Put hash on blockchain
      donationContract.methods
        .uploadEvent(
          result[0].hash,
          inputs.title,
          inputs.description,
          window.web3.utils.toWei(inputs.goal, 'Ether')
        )
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setUploading(false)
          setLoadingMetamask(false)
          setModal(false)
        })
    })
  }

  const donateToEvent = (id, amount) => {
    let donationAmount = window.web3.utils.toWei(amount, 'Ether')

    donationContract.methods
      .tipEventOwner(id)
      .send({ from: account, value: donationAmount })
      .on('transactionHash', (hash) => {})
  }

  // console.log(eventData)

  return (
    <div className="noSelect min-h-screen scroll-smooth bg-black">
      <Head>
        <title>Little Hearts</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header account={account} setModal={setModal} />

      <main className="">
        {false ? (
          <div className="flex h-screen w-full items-center justify-center">
            <svg
              role="status"
              className="mr-2 inline h-16 w-16 animate-spin fill-red-600 text-gray-100 dark:text-gray-700"
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
        ) : (
          <>
            <Banner />
            <Feed
              data={eventData}
              contributors={contributorData}
              donateToEvent={donateToEvent}
            />
            <Description />
            <TopDonators contributorData={contributorData} />
            <Footer />
          </>
        )}

        <AnimatePresence>
          {modal && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
                transition: {
                  duration: 0.3,
                },
              }}
              exit={{
                opacity: 0,
              }}
              className="fixed top-0 left-0 right-0 bottom-0 z-50 flex h-screen w-screen items-center justify-center backdrop-blur-sm"
            >
              <div
                onClick={() => setModal(false)}
                className="absolute h-screen w-screen"
              ></div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: {
                    duration: 0.3,
                  },
                }}
                exit={{
                  scale: 0,
                }}
                className="relative w-3/5 overflow-hidden rounded-md bg-[#191919] p-6 text-white lg:w-1/3"
              >
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {
                      delay: 0.1,
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    x: 100,
                    opacity: 0,
                  }}
                  onClick={() => setModal(false)}
                  className="absolute top-5 right-5 cursor-pointer rounded-full border border-red-500 p-2 
            transition ease-out hover:bg-red-500"
                >
                  <XIcon className="w-5" />
                </motion.div>
                <form
                  className="mt-10 space-y-5"
                  onSubmit={(e) => {
                    {
                      e.preventDefault()
                      sendToBlockchain()
                    }
                  }}
                >
                  &nbsp;
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      y: 30,
                      opacity: 0,
                    }}
                    className="flex items-center space-x-2"
                  >
                    <span className="w-40">Choose Event Image</span>
                    <input
                      type="file"
                      accept=".png, .jpg, .jpeg, .gif"
                      onChange={captureImage}
                      required
                    />
                  </motion.div>
                  <motion.input
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      x: 100,
                      opacity: 0,
                    }}
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, title: e.target.value })
                    }
                    className="w-full px-4 py-2 text-black outline-none"
                    placeholder="Title..."
                    required
                  />
                  <motion.textarea
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      x: 100,
                      opacity: 0,
                    }}
                    type="text"
                    onChange={(e) =>
                      setInputs({ ...inputs, description: e.target.value })
                    }
                    className="w-full px-4 py-2 text-black outline-none"
                    placeholder="Description..."
                    required
                  />
                  <motion.input
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.3,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      x: 100,
                      opacity: 0,
                    }}
                    type="number"
                    onChange={(e) =>
                      setInputs({ ...inputs, goal: e.target.value })
                    }
                    className="w-full px-4 py-2 text-black outline-none"
                    step={0.0000001}
                    placeholder="Goal Amount (Eth)"
                    required
                  />
                  <motion.div
                    initial={{ x: 100, opacity: 0 }}
                    animate={{
                      x: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      x: 100,
                      opacity: 0,
                    }}
                    className="flex h-56 items-center justify-center rounded-md border-4 border-gray-600"
                  >
                    {inputs.image ? (
                      <img
                        className="h-full w-full object-cover"
                        src={`data:image/png;base64,${Buffer.from(
                          inputs.image
                        ).toString('base64')}`}
                      />
                    ) : (
                      <CameraIcon className="m-12 w-20 text-gray-600" />
                    )}
                  </motion.div>
                  <motion.button
                    initial={{ y: 100, opacity: 0 }}
                    animate={{
                      y: 0,
                      opacity: 1,
                      transition: {
                        delay: 0.2,
                        duration: 0.3,
                      },
                    }}
                    exit={{
                      y: 100,
                      opacity: 0,
                    }}
                    type="submit"
                    className="w-full rounded-md bg-red-600 px-4 py-2 transition ease-in-out hover:bg-red-500"
                  >
                    <div className="flex w-full items-center justify-center space-x-2">
                      {uploading ? (
                        <>
                          {loadingMetamask ? (
                            <span>Loading Metamask</span>
                          ) : (
                            <span>Uploading</span>
                          )}
                          <svg
                            role="status"
                            className="mr-2 inline h-5 w-5 animate-spin fill-white text-gray-200 dark:text-red-300"
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
                        </>
                      ) : (
                        <span>Upload</span>
                      )}
                    </div>
                  </motion.button>
                  &nbsp;
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!modal && (
        <div
          className="fixed bottom-5 right-5 z-40 cursor-pointer rounded-full bg-red-500 text-white transition ease-in-out 
          hover:bg-red-600 md:bottom-10 md:right-10 md:hidden"
        >
          <PlusIcon
            className="w-14 p-2"
            onClick={() => {
              loadWeb3()
              if (account) setModal(true)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Home
