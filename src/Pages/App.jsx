import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router'
import Footer from '../Components/Footer'

const App = () => {
  return (
   <div className='inter-regular'>
      <div className='w-full bg-base-200'>
        <Header />
      </div>
      <div className='max-w-7xl mx-auto inter-regular'>
        <Outlet />
      </div>
      <div className=''>
        <Footer />
      </div>
    </div>

  )
}

export default App