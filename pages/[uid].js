import React from 'react'
import { NextSeo } from 'next-seo'

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
  const found = await Recipients.findOne({ $or: [{ _id: uid }, { uid }] })

  if (found) {
    const address = found._id
    const metadata = {
      title: `→ ${found.name || abbreviate(address)}`,
      description: process.env.METADATA_DESC || '',
      previewImg: `https://img.meson.fi/to/${address}`
    }
    return {
      props: { metadata, to: { address, ...found.toJSON() } }
    }
  }

  return { redirect: { destination: '/' } }
}
