import React from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const Front = () => {
  return (
    <div className="min-h-screen bg-pale-white flex flex-col items-center justify-center">
      <main className="container mx-auto flex-1 flex flex-col items-center justify-center text-center p-4">
        <h1 className="text-5xl md:text-7xl font-bold text-dark animate-fade-in-down">
          Welcome to Clientify
        </h1>
        <p className="text-lg md:text-2xl text-gray mt-4 mb-8 animate-fade-in-up">
          Your all-in-one mini CRM portal to manage your business efficiently.
        </p>
        <Link
          className="bg-red text-white px-6 py-3 rounded-full shadow-lg hover:bg-dark transition duration-300 animate-bounce"
          to="/home"
        >
          Get Started
        </Link>
      </main>
      <Footer/>
    </div>
  );
};

export default Front;
