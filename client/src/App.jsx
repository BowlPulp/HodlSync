import { useState } from 'react'
import './App.css'
import HomePage from './components/home/HomePage/HomePage'
import { Route, Routes } from 'react-router-dom'
import UserHome from './components/user/UserHome/UserHome'
import UserLayout from './components/UserLayout'
import AdminLayout from './components/AdminLayout'
import AdminHome from './components/admin/AdminHome/AdminHome'
import NotFound from './NotFound'
import HomePricing from './components/home/HomePricing/HomePricing'
import HomePrivacy from './components/home/HomePrivacy/HomePrivacy'
import HomeContact from './components/home/HomeContact/HomeContact'
import CalculatorLayout from './components/CalculatorLayout'
import CalculatorHome from './components/calculator/CalculatorHome/CalculatorHome'
import SipCalculator from './components/calculator/SipCalculator/SipCalculator'
import LoanCalculator from './components/calculator/LoanCalculator/LoanCalculator'
import SimpleInterestCalculator from './components/calculator/SimpleInterestCalculator/SimpleInterestCalculator'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/pricing" element={<HomePricing/>}/>
    <Route path="/privacy" element={<HomePrivacy/>}/>
    <Route path="/contact" element={<HomeContact/>}/>


    <Route path="/user/" element={<UserLayout />}>
      <Route path="home" element={<UserHome/>} />
    </Route>
    
    <Route path="/admin/" element={<AdminLayout />}>
      <Route path="home" element={<AdminHome/>} />
    </Route>

    <Route path="/calculator/" element={<CalculatorLayout />}>
      <Route path="home" element={<CalculatorHome/>} />
      <Route path="sip-calculator" element={<SipCalculator/>} />
      <Route path="loan-calculator" element={<LoanCalculator/>}/>
      <Route path="simple-interest-calculator" element={<SimpleInterestCalculator/>}/>
    </Route>

    <Route path='*' element={<NotFound/>}/>
  </Routes>
    </>
  )
}

export default App
