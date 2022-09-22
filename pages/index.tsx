/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'
import {
  PublicKey,
  Transaction,
  SystemProgram,
  Keypair,
  Connection
} from '@solana/web3.js'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet, useConnection } from '@solana/wallet-adapter-react'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'

import styles from '../styles/Home.module.css'
import { ART_UPDATE_AUTHORITY, CUSTOM_TOKEN, PRICE } from '../util/constants'
import { useMemo } from 'react'
import { toast } from 'react-toastify'
import {createTransferInstruction} from '@solana/spl-token/src/instructions'
import {getOrCreateAssociatedTokenAccount} from '@solana/spl-token/src/actions'
import { TOKEN_PROGRAM_ID, Token} from '@solana/spl-token'
import { getMint } from '@solana/spl-token/src/state'
import { ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token/src/constants'
import { BANK } from '../util/constants'

const Home: NextPage = () => {
  const { publicKey, signTransaction, connected, sendTransaction } = useWallet()
  const wallet = useWallet()
  const { connection } = useConnection()
  const [tokenBalance, setTokenBalance] = useState<number>(0)
  const [canMint, setCanMint] = useState<boolean>(false)
  
  

  const doIt = async () => {
    if (publicKey == null) return
    console.log("yerp")

    const connection = new Connection('https://ssc-dao.genesysgo.net')

    // send a spl token tx
    // const destination = await Token.getAssociatedTokenAddress(CUSTOM_TOKEN, BANK)
    // const source = await Token.getAssociatedTokenAddress(CUSTOM_TOKEN, publicKey!)
    const ata = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TOKEN_PROGRAM_ID,
      BANK,
      publicKey,
      true
    );

    // catch it 
    

    // const signature = "signature_xsiowejwew"
    // call our backend
    // const resp = await fetch('api/mint', {
    //   body: JSON.stringify({"signature": signature, "address": wallet.publicKey?.toBase58()}),
    //   headers: {
    //     "Content-Type": "application/json; charset=utf8",
    //   },
    //   method: 'POST'
    // })
  }

  // Make sure the connected wallet has enough funds to mint.
  useMemo(async () => {
    if (!publicKey) {
      return
    }
    // public key from the address you want to check the balance for
    const ownerPublicKey = new PublicKey(publicKey)

    // public key from the token contract address
    const tokenPublicKey = new PublicKey(CUSTOM_TOKEN)

    const balance = await connection.getParsedTokenAccountsByOwner(
      ownerPublicKey,
      { mint: tokenPublicKey }
    )

    const tokenBalance =
      balance.value[0]?.account.data.parsed.info.tokenAmount.uiAmount
    setTokenBalance(tokenBalance)
    ;(tokenBalance as number) > PRICE ? setCanMint(true) : setCanMint(false)
  }, [publicKey])

  return (
    <div className='flex flex-col min-h-screen'>
      <Head>
        <title>Edition Printer</title>
        <meta name='description' content='Edition' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <WalletMultiButton />

        <h1 className='font-extrabold tracking-tighter text-center transition-transform ease-in-out bg-transparent sm:leading-4 text-7xl md:text-9xl text-gradient bg-clip-text animated hover:scale-105 hover:skew-y-6 hover:-skew-x-6'>
          Edition Printer
        </h1>
        <div className='relative flex flex-col items-center justify-center w-full py-8 overflow-hidden sm:py-12 lg:pb-8'>
          <div className='flex flex-col items-center pb-5'>
            <h2 className='text-lg font-extrabold tracking-wider text-center uppercase sm:text-2xl font-plex'>
              <span className='pb-1 sm:pb-2 whitespace-nowrap'>
                open edition mints
              </span>
            </h2>
          </div>
          <div className='flex justify-center pt-5'>
            <a className='inline-block max-w-xs overflow-hidden transition duration-300 ease-in-out shadow-xl cursor-pointer rounded-3xl hover:-translate-y-1 hover:scale-102 max-h-xs'>
              <div className='relative w-full overflow-hidden bg-black group rounded-t-3xl'>
                <img
                  src='/infinity.png'
                  className='object-cover w-full h-full duration-700 transform backdrop-opacity-100'
                />
                {/* <div className='absolute flex items-end justify-center w-full h-full bg-gradient-to-t from-black -inset-y-0'>
                  <h1 className='mb-2 text-2xl font-bold text-white'>
                    MonkeDAO
                  </h1>
                </div> */}
              </div>
              <div className='bg-white'>
                {!connected && (
                  <div className='px-3 pt-2 pb-6 text-center'>
                    <p className='mt-2 font-sans font-light text-slate-700'>
                      Please connect your wallet.
                    </p>
                  </div>
                )}
                {connected && (
                  <div className='px-3 pt-2 pb-6 text-center'>
                    <p className='mt-2 font-sans font-light text-slate-700'>
                      It is your time to mint.
                    </p>
                    <button
                      disabled={!canMint}
                      onClick={doIt}
                      className='w-24 px-3 py-3 mt-4 border border-black rounded-lg hover:bg-black hover:text-white'
                    >
                      {canMint ? 'Mint me' : 'Need more tokens'}
                    </button>
                  </div>
                )}
              </div>
            </a>
          </div>
        </div>
      </main>

      <footer>
        <div
          className='p-4 text-center'
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          Made with ❤️
        </div>
      </footer>
    </div>
  )
}

export default Home
