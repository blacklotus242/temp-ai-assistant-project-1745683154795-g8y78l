import React from 'react';
import { Menu, X, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const TopNav: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { user, logout } = useAuth();
  
  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex items-center">
            {/* Mobile menu button */}
            <button 
              type="button" 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center ml-4 lg:ml-0">
              <span className="text-xl font-bold text-gradient">Nova</span>
            </div>
          </div>
          
          {/* Desktop Navigation Items */}
          <div className="hidden lg:ml-6 lg:flex lg:items-center lg:space-x-4">
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800">
              Documentation
            </button>
            <button className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800">
              Settings
            </button>
          </div>
          
          {/* Profile dropdown */}
          <div className="flex items-center">
            <div className="relative ml-3">
              <div className="flex items-center">
                <button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                </button>
                <div className="ml-3 hidden lg:block">
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button 
                  onClick={logout}
                  className="ml-3 p-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
                  title="Sign out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left">
              Documentation
            </button>
            <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-800 w-full text-left">
              Settings
            </button>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-800">
            <div className="flex items-center px-5">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-white">{user?.name}</div>
                <div className="text-sm font-medium text-gray-400">{user?.email}</div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left">
                <div className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  Profile
                </div>
              </button>
              <button className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left">
                <div className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </div>
              </button>
              <button 
                onClick={logout}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
              >
                <div className="flex items-center">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign out
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default TopNav;