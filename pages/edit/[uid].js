import React from 'react'
import { NextSeo } from 'next-seo'

import { abbreviate } from 'lib'
import { Recipients } from 'lib/db'
import PageEdit from 'components/PageEdit'

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

  return {
    props: { to: { address: uid } }
  }
}