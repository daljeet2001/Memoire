import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import FeaturesSection from '../components/FeaturesSection'
import { Link } from "react-router-dom";
const LandingPage = () => {
  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <div className="flex justify-center bg-white px-8 py-20 font-chewy">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl w-full items-center">
          
          {/* Left Content */}
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Shared Journal
            </h1>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              A beautiful space for couples to keep track of their memories, 
              special moments, and loved ones. Strengthen your bond by 
              journaling together.
            </p>

            {/* CTA Button */}
            <Link to="/register" className="px-8 py-4  text-lg font-medium rounded-xl shadow-md bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
              Get Started
            </Link>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <img
              src="/l5.jpg"
              alt="Couple Illustration"
              className="w-full h-[450px] md:h-[550px] object-cover "
            />
          </div>
        </div>
      </div>
      <FeaturesSection/>

      <Footer />
    </div>
  )
}

export default LandingPage
