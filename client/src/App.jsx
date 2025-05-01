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
import CompoundInterestCalculator from './components/calculator/CompoundInterestCalculator/CompoundInterestCalculator'
import FDCalculator from './components/calculator/FDCalculator/FDCalculator'
import SWPCalculator from './components/calculator/SWPCalculator/SWPCalculator'
import InflationCalculator from './components/calculator/InflationCalculator/InflationCalculator'
import TargetAmountCalculator from './components/calculator/TargetAmountCalculator/TargetAmountCalculator'
import ArbitrageCalculator from './components/calculator/ArbitrageCalculator/ArbitrageCalculator'
import CurrencyConverter from './components/calculator/CurrencyCalculator/CurrencyCalculator'
import HomeSignup from './components/home/HomeSignup/HomeSignup'
import HomeLogin from './components/home/HomeLogin/HomeLogin'
import TestCookie from './components/test/TestCookie'
import AICalculator from './components/calculator/AICalculator/AICalculator'
import HomeNews from './components/home/HomeNews/HomeNews'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
  <Routes>
    <Route path="/" element={<HomePage/>}/>
    <Route path="/pricing" element={<HomePricing/>}/>
    <Route path="/privacy" element={<HomePrivacy/>}/>
    <Route path="/contact" element={<HomeContact/>}/>
    <Route path="/signup" element={<HomeSignup/>}/>
    <Route path='/login' element={<HomeLogin/>}/>
    <Route path='/test-cookie' element={<TestCookie/>}/>
    <Route path='/news' element={<HomeNews/>}/>

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
      <Route path="compound-interest-calculator" element={<CompoundInterestCalculator/>}/>
      <Route path='fd-calculator' element={<FDCalculator/>}/>
      <Route path='swp-calculator' element={<SWPCalculator/>}/>
      <Route path='inflation-calculator' element={<InflationCalculator/>}/>
      <Route path='target-amount-calculator' element={<TargetAmountCalculator/>}/>
      <Route path='arbitrage-calculator' element={<ArbitrageCalculator/>}/>
      <Route path='currency-calculator' element={<CurrencyConverter/>}/>
      <Route path='ai-calculator' element={<AICalculator/>}/>
    </Route>

    <Route path='*' element={<NotFound/>}/>
  </Routes>
    </>
  )
}

export default App
