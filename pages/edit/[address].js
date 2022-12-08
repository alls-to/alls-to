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
      <PageEdit to={to} />
    </>
  )
}

export async function getServerSideProps ({ query, res }) {
  let address = query.address
  const stored = await Recipients.findOne({ _id: address })

  const metadata = {
    title: `→ ${abbreviate(address)}`,
    description: process.env.METADATA_DESC || '',
    previewImg: `https://img.meson.fi/to/${address}`
  }

  if (stored) {
    return {
      props: { metadata, to: { address, ...stored.toJSON() } }
    }
  }

  return {
    props: { metadata, to: { address } }
  }
}
