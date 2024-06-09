import React from "react";
import Navbar from "../components/Navbar";

const Front = () => {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <h1 className="text-5xl">Front Page</h1>
      </div>
    </div>
  );
};

export default Front;
