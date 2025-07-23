import React from "react";
import { Link, useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.png";
import Alert from "../../assets/alert.gif";
import SearchBox from "./SearchBox/Search";

import { FaPlusCircle, FaUser } from "react-icons/fa";

function Head() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login')
  }
  

  return (
    <div className="w-full">
      <div className="bg-[#bb2649] py-2">
        <div className="max-w-[1200px] mx-auto px-4">
          <p className="text-white text-center font-medium text-sm m-0">
            Please be aware of scams.
          </p>
        </div>
      </div>

      <header className="w-full py-6 font-medium">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="flex items-center">
            <div className="flex items-center w-1/6">
              <Link to="/">
                <img src={Logo} alt="Logo" className="w-4/5 h-auto" />
              </Link>
            </div>

            <div className="w-5/6 flex items-center space-x-20">
              <SearchBox />

              <button
                aria-label="Add new item"
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                <FaPlusCircle className="text-2xl" />
              </button>

              <button
                aria-label="User profile"
                className="w-10 h-10 flex items-center justify-center rounded-full text-gray-700 hover:text-black transition-colors cursor-pointer"
              >
                <FaUser className="text-2xl" onClick={handleLoginClick}/>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="text-center">
        <img src={Alert} alt="alert" className="w-full max-w-6xl mx-auto" />
      </div>
    </div>
  );
}

export default Head;
