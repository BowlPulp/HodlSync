import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import HomeNavbar from './home/HomeNavbar/HomeNavbar';


function HomeLayout() {
  return (
    <div>
        <HomeNavbar/>
        {/* Render the nested routes for the User role */}
        <Outlet />
       <Footer/>
      </div>
  );
}

export default HomeLayout;
