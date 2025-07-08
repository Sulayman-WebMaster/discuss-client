import React from 'react'
import { Link } from 'react-router'

const Footer = () => {
  return (
    <footer className="bg-black text-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-10">
        
        {/* Column 1: Brand/Intro */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Discuss</h2>
          <p className="text-gray-400">
            Empowering learners through engaging discussions, insightful courses, and real community support.
          </p>
        </div>

        {/* Column 2: Links */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><Link to="/" className="hover:text-white transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-white transition">About</Link></li>
            <li><Link to="/courses" className="hover:text-white transition">Courses</Link></li>
            <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
          </ul>
        </div>

        {/* Column 3: Info */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Contact</h3>
          <p className="text-gray-300 mb-2">Email: support@discuss.com</p>
          <p className="text-gray-300 mb-4">Phone: +880 1234 567890</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">Facebook</a>
            <a href="#" className="hover:text-white transition">Twitter</a>
            <a href="#" className="hover:text-white transition">LinkedIn</a>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="mt-10 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Discuss. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
