import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Footer from './footer/Footer';
import UserNavbar from './user/UserNavbar/UserNavbar';


function UserLayout() {
  return (
    <div>
        <UserNavbar/>
        {/* Render the nested routes for the User role */}
        <Outlet />
       <Footer/>
      </div>
  );
}

export default UserLayout;
