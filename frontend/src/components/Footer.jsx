import React from 'react'
import { Link } from 'react-router-dom'
import { 
  Gift, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Facebook, 
  Twitter,
  LayoutDashboard,
  Store
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Pamper Periods
                </div>
                <div className="text-sm text-gray-500">Premium Gifting</div>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Creating unforgettable moments through premium gifting experiences. Your happiness is our greatest gift.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <button
                  key={index}
                  className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-pink-100 hover:text-pink-600 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">Explore</h3>
            <div className="space-y-3">
              {[
                { name: "All Products", path: "/products" },
                { name: "Gift Bundles", path: "/bundles" },
                { name: "About Us", path: "/about" },
              ].map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-gray-600 hover:text-pink-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Portals / Support */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">Partner Portals</h3>
            <div className="space-y-3">
              <Link to="/admin/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors">
                <LayoutDashboard className="w-4 h-4" />
                Admin Panel
              </Link>
              <Link to="/vendor/login" className="flex items-center gap-2 text-gray-600 hover:text-pink-600 transition-colors">
                <Store className="w-4 h-4" />
                Vendor Portal
              </Link>
              <Link to="/contact-us" className="block text-gray-600 hover:text-pink-600 transition-colors">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-6 text-gray-900">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5 text-pink-500" />
                <span className="text-sm">123 Gift Street, Mumbai, India</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Phone className="w-5 h-5 text-pink-500" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Mail className="w-5 h-5 text-pink-500" />
                <span className="text-sm">hello@pamperperiods.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 mb-4 md:mb-0 text-sm">
            © {new Date().getFullYear()} Pamper Periods. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm text-gray-600">
            <Link to="/privacy" className="hover:text-pink-600 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-pink-600 transition-colors">Terms of Service</Link>
            <Link to="/refund" className="hover:text-pink-600 transition-colors">Refund Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}