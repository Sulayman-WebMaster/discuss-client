import React from 'react'
import { Link, NavLink } from 'react-router'

const Header = () => {
  return (
    <div className='max-w-7xl mx-auto '>
      <div className="navbar py-3 px-0 flex justify-between items-center">
        {/* Logo + Mobile Menu */}
        <div className="navbar-start">
          <div className="dropdown lg:hidden">
            <div tabIndex={0} role="button" className="btn btn-ghost p-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h12m-12 6h16" />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow-lg bg-white rounded-box w-52"
            >
              <li>
                <NavLink to="/" className="hover:text-primary">Home</NavLink>
              </li>
              <li>
                <NavLink to="/about" className="hover:text-primary">About</NavLink>
              </li>
              <li>
                <NavLink to="/courses" className="hover:text-primary">Courses</NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="hover:text-primary">Contact</NavLink>
              </li>
            </ul>
          </div>

          {/* Logo */}
          <Link to="/">
            <h3 className='text-2xl md:text-3xl font-bold text-black'>Discuss.</h3>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="navbar-center hidden lg:flex">
          <ul className="flex gap-6 px-1 text-base font-medium">
            {['/', '/about', '/courses', '/contact'].map((path, i) => (
              <li key={i} className="list-none">
                <NavLink
                  to={path}
                  className={({ isActive }) =>
                    `relative pb-1 transition-all duration-300 ease-in-out hover:text-black ${
                      isActive ? 'text-black after:w-full' : 'text-gray-900 after:w-0'
                    } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-black after:transition-all after:duration-300 hover:after:w-full`
                  }
                >
                  {['Home', 'About', 'Courses', 'Contact'][i]}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Buttons */}
        <div className="navbar-end">
          <div className='flex gap-2'>
            <Link to="/login">
              <button className="w-[110px] bg-black text-white py-2 rounded-full hover:bg-gray-800 transition duration-300 font-semibold shadow">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="w-[110px] border border-black text-black py-2 rounded-full hover:bg-black hover:text-white transition duration-300 font-semibold shadow">
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Header
