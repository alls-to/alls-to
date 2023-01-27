import React from 'react'
import { NextSeo } from 'next-seo'

import { abbreviate } from 'lib'
import PageTo from 'components/PageTo'

const isProd = process.env.NODE_ENV === 'production'

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
  const { queryPage } = require('lib/alls.to')
  const result = await queryPage(query.key, isProd)

  if (result) {
    const metadata = {
      title: `Transfer → ${result.name || abbreviate(result.address)}`,
      description: process.env.METADATA_DESC || '',
      previewImg: `https://img.meson.fi/to/${result.key || result.address}`
    }
    return {
      props: { metadata, to: result }
    }
  }

  return { redirect: { destination: '/' } }
}
