import React from 'react';
import { Link } from "react-router-dom"

import Logo from "../../assets/logo.png"
import Alert from "../../assets/alert.gif"
function Head() {
  return (
    <>
      <div className='w-full'>
        <div className='bg-[#bb2649] py-2'>
          <div className='max-w-[1200px] mx-auto px-4'>
            <p className='text-white text-center font-medium text-sm m-0'>
              Please be aware of scams.
              </p>
          </div>
        </div>

        <header>
          <div>
            <div>
              <div>
                <button>
                  <Link to="/">
                    <img src={Logo} alt='logo' />
                  </Link>
                </button>
              </div>
              <div>
                <div>
                        {/* here goes the searchbox thing*/}
                    <div>
                      <button>
                        <p>post</p>
                      </button>
                    </div>
                    <div>
                      <button>
                        <p>userprofile</p>
                      </button>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </header>
      <div>
      <img src={Alert} alt='alert'/>
      </div>
      </div>
    </>
  );
}

export default Head;
