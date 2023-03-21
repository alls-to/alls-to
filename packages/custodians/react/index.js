import React from 'react'

export const CustodianContext = React.createContext()

export const CustodianProvider = ({ custodians, children }) => {
  const value = React.useMemo(() => ({
    custodians,
  }), [custodians])

  return React.createElement(CustodianContext.Provider, { value }, children)
}

export const useCustodians = () => {
  const value = React.useContext(CustodianContext)
  return value
}
