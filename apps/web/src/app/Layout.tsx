import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components";

const Layout: React.FC = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default Layout;
