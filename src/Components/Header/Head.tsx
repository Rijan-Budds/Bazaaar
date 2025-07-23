  import React from "react";
  import { Link } from "react-router-dom";

  import Logo from "../../assets/logo.png";
  import Alert from "../../assets/alert.gif";
  import SearchBox from "./SearchBox/Search";

  function Head() {
    return (
      <>
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
                  <button>
                    <Link to="/">
                      <img src={Logo} alt="logo" className="w-4/5 h-auto"/>
                    </Link>
                  </button>
                </div>
                <div className="w-5/6">
                  <div className="flex items-center">
                    <SearchBox />
                    <div className="ml-4">
                      <button className="">
                      <p>addbutton</p>
                      </button>
                    </div>
                    <div className="ml-4">
                      <button className="">
                        <p>userprofile</p>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <div className="text-center">
            <img src={Alert} alt="alert" className="w-full max-w-6xl mx-auto"/>
          </div>
        </div>
      </>
    );
  }

  export default Head;
