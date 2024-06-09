import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import AddCustomer from "./AddCustomer";
import AddOrder from "./AddOrder";
import CreateCampaign from "./CreateCampaign";
import CampaignsList from "./CampaignsList";
import { FaUserEdit } from "react-icons/fa";
import Profile from "./Profile";

const Home = () => {
  const [activeTab, setActiveTab] = useState("AddCustomer");

  // Function to handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Store active tab in local storage
    localStorage.setItem("ActiveTab", tab);
  };

  // Define sidebar items
  const sidebarItems = [
    { text: "AddCustomer", icon: <FaUserEdit size={25} /> },
    { text: "AddOrder", icon: <FaUserEdit size={25} /> },
    { text: "CreateCampaign", icon: <FaUserEdit size={25} /> },
    { text: "CampaignsList", icon: <FaUserEdit size={25} /> },
    { text: "Profile", icon: <FaUserEdit size={25} /> },

  ];

  // Effect to retrieve active tab from local storage on component mount
  useEffect(() => {
    const storedTab = localStorage.getItem("ActiveTab");
    if (storedTab) {
      setActiveTab(storedTab);
    }
  }, []);
  return (
    <>
      <div className="flex dynamic-height-div h-[calc(100vh-5vh)]">
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          sidebarItems={sidebarItems}
          category="Dashboard"
        />
        <div className="flex-1 ml-2 overflow-y-hidden">
          {activeTab === "AddCustomer" && <AddCustomer />}
          {activeTab === "AddOrder" && <AddOrder />}
          {activeTab === "CreateCampaign" && <CreateCampaign />}
          {activeTab === "CampaignsList" && <CampaignsList />}
          {activeTab === "Profile" && <Profile />}
        </div>
      </div>
    </>
  );
};

export default Home;
