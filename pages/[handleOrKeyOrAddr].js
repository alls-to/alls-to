import React from 'react'
import { NextSeo } from 'next-seo'

import { abbreviate } from 'lib'
import PageTo from 'components/PageTo'
import { queryPage } from '../lib/alls.to'

const isProd = process.env.NODE_ENV === 'production'

export default function Subpage ({ toList = [] }) {
  const to = { ...toList[0] }
  if (to.addr.startsWith('sui')) {
    to.addr = to.addr.replace('sui:', '')
  }

  const metadata = {
    title: `Transfer → ${to.name || abbreviate(to.addr)}`,
    description: process.env.METADATA_DESC || '',
    previewImg: `https://img.meson.fi/to/${encodeURIComponent(to.key || to.addr)}`
  }

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
  const toList = await queryPage(query.handleOrKeyOrAddr, isProd)

  if (!toList.length) {
    return { redirect: { destination: '/' } }
  }
  
  return { props: { toList: toList.map(doc => doc.toJSON()) } }
}
