import React from 'react'
import { NextSeo } from 'next-seo'

import { utils } from 'ethers'
import TronWeb from 'tronweb'

import { Recipients } from 'lib/db'
import PageTo from 'components/PageTo'

export default function Subpage ({ metadata, to = null }) {
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
      <PageTo to={to} />
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
    description: process.env.METADATA_DESC || '',
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
