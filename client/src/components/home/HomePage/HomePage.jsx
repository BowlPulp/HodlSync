import React from 'react'
import { VelocityHero } from '../HomeHero/VelocityHero'
import AboutHodlSync from '../HomeHero/AboutHodlSync'
import TopCryptoList from '../HomeHero/TopCryptoList'
import AccordionSolutions from '../HomeHero/AccordionSolutions'
import HomeNavbar from '../homenavbar/homenavbar'
import Footer from '../../footer/Footer'

const HomePage = () => {
  return (
    <>
    <div className="bg-black text-center text-white">
    <HomeNavbar/>
    <VelocityHero/>
    <AboutHodlSync/>
    <TopCryptoList/>
    <AccordionSolutions/>
    <Footer/>
    </div>
    </>
  )
}

export default HomePage