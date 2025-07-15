import type React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="footer-container bg-gray-50 py-10 px-5 border-t border-gray-200 text-gray-800 font-poppins w-full">
      <div className="footer-content flex flex-wrap justify-between max-w-[1200px] mx-auto gap-7.5">
        
        <div className="footer-section company flex-grow flex-shrink basis-[250px]">
          <h3 className="text-3xl font-semibold  mb-4">Bazaar</h3>
          <p className="text-sm text-gray-600 mb-2">Buy, sell and discover amazing second-hand deals around you.</p>
        </div>

        <div className="flex-grow flex-shrink">
          <h4 className="text-lg font-semibold text-[#bb2649] mb-4">Quick Links</h4>
          <ul className="list-none p-0 m-0">
            <li><a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">About Us</a></li>
            <li><a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">Contact</a></li>
            <li><a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">Terms & Conditions</a></li>
            <li><a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="flex-grow flex-shrink basis-[250px]">
          <h4 className="text-lg font-semibold text-[#bb2649] mb-4">Contact Me</h4>
          <p>Email: rijanshakya123@gmail.com</p>
          <p>Phone: 9813447225</p>
          <p>Address: Suryamadhi, Bhaktapur</p>
        </div>

        <div className="flex-grow flex-shrink basis-[250px]">
          <h4 className="text-lg font-semibold text-[#bb2649] mb-4">Follow us</h4>
          <div className="social-icons">
            <a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">facehook</a>
            <a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">Instagram</a>
            <a href="#" className="text-gray-600 no-underline transition-colors duration-200 hover:text-[#ff4d79]">Twitter</a>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-gray-300 mt-10 pt-5 text-xs text-gray-500">
        <p>© 2023 Bazaar. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
