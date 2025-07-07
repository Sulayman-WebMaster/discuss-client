import React from 'react'
import Header from '../Components/Header'
import { Outlet } from 'react-router'
import Footer from '../Components/Footer'

const App = () => {
  return (
    <div className='max-w-7xl mx-auto'>
     <Header/>
     <Outlet/>
     <Footer/>
    </div>
  )
}

export default App