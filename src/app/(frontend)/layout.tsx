import React from 'react'
import MainNavi from '../main-navi/page'

export default function FrontendLayout({children} : {children : React.ReactNode}) {
  return (
    <div>
        <MainNavi />
        {children}
    </div>
  )
}
