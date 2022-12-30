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
  const conditions = [{ _id: uid }, { uid }]
  if (uid.length === 12) {
    conditions.push({ _id: { $gt: uid, $lt: `${uid}~` } })
  }
  const found = await Recipients.findOne({ $or: conditions })

  if (found) {
    const address = found._id
    const metadata = {
      title: `Pay → ${found.name || abbreviate(address)}`,
      description: process.env.METADATA_DESC || '',
      previewImg: `https://img.meson.fi/to/${found.uid || found._id}`
    }
    return {
      props: { metadata, to: { address, ...found.toJSON() } }
    }
  }

  return { redirect: { destination: '/' } }
}
