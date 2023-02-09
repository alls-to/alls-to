import React from 'react'
import classnames from 'classnames'
import groupBy from 'lodash/groupBy'
import mapValues from 'lodash/mapValues'

import Button from 'components/common/Button'

export default function LoginWallets ({ loading, extensions, onConnect }) {
  const [extList, setExtList] = React.useState([])

  React.useEffect(() => {
    setTimeout(() => {
      const exts = Object.values(mapValues(
        groupBy(
          extensions.detectAllExtensions().filter(ext => ext.type !== 'walletconnect'),
          'type'
        ),
        grouped => grouped.every(ext => ext.notInstalled) ? grouped[0] : grouped.filter(ext => !ext.notInstalled)
      )).flat()
      setExtList(exts)
    }, 100)
  }, [extensions])

  if (loading) {
    return <div className='self-center font-light'>Loading...</div>
  }

  return (
    <div className='flex flex-col gap-4 -mx-6 px-6 md:-mx-8 md:px-8 max-h-[320px] overflow-y-auto'>
      {extList.map(ext => (
        <Button
          key={ext.id}
          size='lg'
          type='glass'
          className='justify-between'
          onClick={() => ext.notInstalled ? window.open(ext.installLink, '_blank') : onConnect(ext)}
        >
          {
            ext.notInstalled
            ? <div className='opacity-50'>Get {ext.name}</div>
            : <div>{ext.name}</div>
          }
          <div className={classnames(
            'flex w-8 h-8 bg-white items-center justify-center rounded-md',
            ext.notInstalled && 'opacity-50'
          )}>
            <img alt={ext.name} crossOrigin='anonymous' className='w-6 h-6' src={ext.icon} />
          </div>
        </Button>
      ))}
    </div>
  )
}