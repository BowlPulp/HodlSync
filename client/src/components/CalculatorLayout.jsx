import React from 'react'
import HomeNavbar from './home/HomeNavbar/HomeNavbar'
import { Outlet } from 'react-router-dom'
import Footer from './footer/Footer'

const CalculatorLayout = () => {
  return (
    <>
    <HomeNavbar/>
     {/* Render the nested routes for the Calculator */}
    <Outlet/>
    <Footer/>
    </>

  )
}

export default CalculatorLayout