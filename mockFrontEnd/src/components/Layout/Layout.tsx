import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout: React.FC = () => {
  const userName = "John Doe";
  const userEmail = "john.doe@gmail.com";

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Header userName={userName} userEmail={userEmail} />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
