import React from 'react'

import CentralCardWithSideInfo from 'components/common/Card/CentralCardWithSideInfo'
import IntroRegion from 'components/common/Card/IntroRegion'
import Card from 'components/common/Card'

import CardBodyEdit from '../PageTo/CardBody/CardBodyEdit'

export default function CardCreate ({ to }) {
  return (
    <CentralCardWithSideInfo>
      <Card bg='pos2' className='p-3 xs:p-4 md:p-6'>
        <div className='flex flex-row justify-between'>
          <div className='font-semibold'>CREATE MY ALLS.TO LINK</div>
        </div>

        <CardBodyEdit to={to} />
      </Card>
      <IntroRegion />
    </CentralCardWithSideInfo>
  )
}
