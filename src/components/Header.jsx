import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaGraduationCap } from 'react-icons/fa';

const Header = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
  const isDashboard = ['/student', '/teacher'].includes(location.pathname);

 
  if (isDashboard) {
    return null;
  }

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex">
            <Link to="/" className="flex items-center">
              <FaGraduationCap className="h-8 w-8 text-purple-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">Exam System</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden sm:flex sm:space-x-8">
            <Link
              to="/about"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/about')
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            >
              About
            </Link>
            <Link
              to="/features"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/features')
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            >
              Features
            </Link>
            <Link
              to="/contact"
              className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                isActive('/contact')
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-500 hover:text-gray-900 hover:border-gray-300 border-b-2 border-transparent'
              }`}
            >
              Contact
            </Link>
          </div>

          {/* Auth Links */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {!isAuthPage && (
              <>
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
            <Link
              to="/privacy"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Terms
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header; 