import React from 'react'
import { NextSeo } from 'next-seo'

import { utils } from 'ethers'
import TronWeb from 'tronweb'

import MesonToButton from '@mesonfi/to'

import { Recipients } from '../lib/db'

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
      {
        isBrowser && to &&
        <MesonToButton
          appId='alls-to'
          type='iframe'
          to={to}
          onCompleted={() => {}}
        />
      }
      <pre className='mt-6 text-xs'>{JSON.stringify(to, null, 2)}</pre>
      </div>
    </>
  )
}

export async function getServerSideProps ({ query, res }) {
  let address = query.address
  let chain
  if (utils.isAddress(address)) {
    address = address.toLowerCase()
    chain = 'polygon'
  } else if (TronWeb.isAddress(address)) {
    chain = 'tron'
  } else {
    res.writeHead(302, { Location: 'https://alls.to' })
    res.end()
    return { props: {} }
  }

  const stored = await Recipients.findOne({ _id: address })

  const metadata = {
    title: 'Alls To',
    description: 'Transfer stablecoins from anywhere',
    previewImg: `https://meson.to/img/to/${address}`
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
