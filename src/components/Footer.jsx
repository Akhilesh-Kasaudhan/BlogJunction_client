import React from "react";

const Footer = () => {
  return (
    <footer className="bg-base-300 text-base-content px-8 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Description */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img
              src="/fvicon.png"
              alt="Blog Junction logo"
              className="  rounded-full w-10"
            />
            <span className="font-bold text-xl">Blog Junction</span>
          </div>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. <br />
            Rerum unde quaerat eveniet cumque accusamus atque qui <br />
            error quo enim fugiat?
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-semibold mb-2">Quick Links</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Home</li>
            <li>Best Sellers</li>
            <li>Offers & Deals</li>
            <li>Contact Us</li>
            <li>FAQs</li>
          </ul>
        </div>

        {/* Help Section */}
        <div>
          <h4 className="font-semibold mb-2">Need Help?</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Delivery Information</li>
            <li>Return & Refund Policy</li>
            <li>Payment Methods</li>
            <li>Track your Order</li>
            <li>Contact Us</li>
          </ul>
        </div>

        {/* Social Links */}
        <div>
          <h4 className="font-semibold mb-2">Follow Us</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>Instagram</li>
            <li>Twitter</li>
            <li>Facebook</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-base-300 mt-10 pt-6 text-center text-sm text-gray-500">
        Copyright © 2025 © QuickBlog GreatStack - All Right Reserved.
      </div>
    </footer>
  );
};

export default Footer;
