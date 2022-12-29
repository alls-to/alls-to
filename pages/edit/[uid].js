import React from 'react'
import { NextSeo } from 'next-seo'
import { getAddressFormat } from '@mesonfi/web3-jwt/lib'

import { abbreviate } from 'lib'
import { Recipients } from 'lib/db'
import PageEdit from 'components/PageEdit'

const DEFAULT_NETWORKS = {
  ethers: 'polygon',
  tron: 'tron',
  aptos: 'aptos'
}

export default function EditPage ({ metadata, to = null }) {
  const seo = metadata && <NextSeo
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
  return (
    <>
      {seo}
      <PageEdit to={to} />
    </>
  )
}

export async function getServerSideProps ({ query, res }) {
  let uid = query.uid
  const found = await Recipients.findOne({ $or: [{ _id: uid }, { uid }] })

  if (found) {
    const address = found._id
    const metadata = {
      title: `Edit → ${found.name || abbreviate(address)}`
    }
    return {
      props: { metadata, to: { address, ...found.toJSON() } }
    }
  }

  const type = getAddressFormat(uid)
  if (!type) {
    return { redirect: { destination: '/' } }
  }

  const address = type === 'tron' ? uid : uid.toLowerCase()
  const created = await Recipients.create({
    _id: address,
    networkId: DEFAULT_NETWORKS[type],
    tokens: [type === 'tron' ? 'usdt' : 'usdc']
  })
  return {
    props: { to: { address, ...created.toJSON() } }
  }
}
