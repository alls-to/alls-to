import React from 'react'
import dynamic from 'next/dynamic'
import { NextSeo } from 'next-seo'

import { utils } from 'ethers'
import TronWeb from 'tronweb'

import { Recipients } from '../lib/db'

const MesonToButton = dynamic(import('@mesonfi/to'), { ssr: false })

export default function AllsTo ({ metadata, to = null }) {
  const [isBrowser, setIsBrowser] = React.useState(false)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true)
    }
  }, [])

  return (
    <>
      <NextSeo
        title={metadata.title}
        description={metadata.description}
        openGraph={{
          title: metadata.title,
          description: metadata.description,
          images: [
            { url: metadata.previewImg }
          ]
        }}
      />
      <div className='flex flex-col items-start p-12'>
      <MesonToButton
        appId='alls-to'
        type='iframe'
        to={to}
        onCompleted={() => {}}
      />
      <pre className='mt-6 text-xs'>{JSON.stringify(to, null, 2)}</pre>
      </div>
    </>
  )
}

export async function getServerSideProps ({ query, res }) {
  let chain
  let address = query.address
  let abbr
  if (utils.isAddress(address)) {
    address = address.toLowerCase()
    abbr = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    chain = 'polygon'
  } else if (TronWeb.isAddress(address)) {
    chain = 'tron'
    abbr = `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
  } else {
    res.writeHead(302, { Location: 'https://alls.to' })
    res.end()
    return { props: {} }
  }

  const stored = await Recipients.findOne({ _id: address })

  const metadata = {
    title: `Transfer Stablecoins to ${abbr}`,
    description: process.env.METADATA_DESC,
    previewImg: `https://img.meson.fi/to/${address}`
  }

  if (stored) {
    return {
      props: { metadata, to: { address, ...stored.toJSON() } }
    }
  }

  return {
    props: { metadata, to: { address, chain } }
  }
}
