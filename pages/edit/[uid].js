import React from 'react'
import { NextSeo } from 'next-seo'

import { Recipients } from 'lib/db'
import PageEdit from 'components/PageEdit'

const HORIZONTAL_ELLIPSIS = '\u2026'
function abbreviate (address, start = 4, end = start) {
  if (!address) {
    return address
  }
  if (address.startsWith('0x')) {
    start += 2
  }
  const length = address.length
  if (length <= start + end) {
    return address
  }
  return `${address.slice(0, start)}${HORIZONTAL_ELLIPSIS}${address.slice(length - end)}`
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
  const uid = query.uid
  const stored = await Recipients.findOne({ $or: [{ _id: uid }, { uid }] })

  if (stored) {
    const address = stored._id
    const metadata = {
      title: `→ ${abbreviate(address)}`,
      description: process.env.METADATA_DESC || '',
      previewImg: `https://img.meson.fi/to/${address}`
    }
    return {
      props: { metadata, to: { address, ...stored.toJSON() } }
    }
  }

  return {
    props: { to: { address: uid } }
  }
}
