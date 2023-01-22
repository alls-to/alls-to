import React from 'react'
import { NextSeo } from 'next-seo'
import TronWeb from 'tronweb'

import { abbreviate } from 'lib'
import { Recipients } from 'lib/db'
import PageTo from 'components/PageTo'

export default function Subpage ({ metadata, to = null }) {
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
      <PageTo to={to} />
    </>
  )
}

export async function getServerSideProps ({ query, res }) {
  const uid = query.uid
  const conditions = [{ _id: uid }, { uid }]
  if (uid.length === 12) {
    conditions.push({ _id: { $gt: uid, $lt: `${uid}~` } })
  }

  let match = await Recipients.findOneAndUpdate({ $or: conditions }, { $inc: { clicks: 1 } })
  if (!match && uid.startsWith('T') && TronWeb.isAddress(uid)) {
    match = await Recipients.findByIdAndUpdate(uid, {
      _id: uid,
      networkId: 'tron',
      tokens: ['usdt'],
      clicks: 1
    }, { upsert: true, new: true })
  }

  if (match) {
    const address = match._id
    const metadata = {
      title: `Transfer → ${match.name || abbreviate(address)}`,
      description: process.env.METADATA_DESC || '',
      previewImg: `https://img.meson.fi/to/${match.uid || match._id}`
    }
    return {
      props: { metadata, to: { address, ...match.toJSON() } }
    }
  }

  return { redirect: { destination: '/' } }
}
