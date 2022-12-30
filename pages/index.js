import { NextSeo } from 'next-seo'

import PageIndex from 'components/PageIndex'

export default function Index() {
  const metadata = {
    title: 'Alls.To',
    description: process.env.METADATA_DESC || ''
  }

  const seo = <NextSeo
    title={metadata.title}
    description={metadata.description}
    openGraph={{
      title: metadata.title,
      description: metadata.description,
      // images: [
      //   { url: metadata.previewImg }
      // ]
    }}
  />
  
  return (
    <>
      {seo}
      <PageIndex />
    </>
  )
}
