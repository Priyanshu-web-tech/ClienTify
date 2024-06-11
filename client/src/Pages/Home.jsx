import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

import {
  FaUserPlus as AddCustomerIcon,
  FaShoppingCart as AddOrderIcon,
  FaEnvelope as CreateCampaignIcon,
  FaListAlt as CampaignsListIcon,
  FaUserCircle as ProfileIcon,
  FaUsers as CreateAudienceIcon, // New Icon for Create Audience
} from "react-icons/fa"; 

const Home = () => {
  const routes = [
    { path: "", name: "Profile", icon: <ProfileIcon size={25} /> },
    {
      path: "add-customer",
      name: "AddCustomer",
      icon: <AddCustomerIcon size={25} />,
    },
    { path: "add-order", name: "AddOrder", icon: <AddOrderIcon size={25} /> },
    {
      path: "create-campaign",
      name: "Create Campaign",
      icon: <CreateCampaignIcon size={25} />,
    },
    {
      path: "create-audience",
      name: "Create Audience",
      icon: <CreateAudienceIcon size={25} />, // Changed to CreateAudienceIcon
    },
    {
      path: "campaigns-list",
      name: "Campaign List",
      icon: <CampaignsListIcon size={25} />,
    },
  ];

  return (
    <>
      <div className="flex dynamic-height-div h-[calc(100vh-10vh)]">
        <Sidebar routes={routes} />
        <div className="flex-1 ml-2 overflow-y-scroll">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Home;
