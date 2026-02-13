import { LayoutDashboard, MessageSquare, Settings, HelpCircle, X, FileText } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserProfile } from '../api/user';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Manage Complaints', id: 'manage-complaints', path: '/dashboard/manage-complaints' },
  { icon: MessageSquare, label: 'AI Assistant', id: 'chatbot', path: '/dashboard/chatbot' },
  { icon: Settings, label: 'Settings', id: 'settings', path: '/dashboard/settings' },
  { icon: HelpCircle, label: 'Help', id: 'help', path: '/dashboard/help' },
];

export function Sidebar({ isOpen, onClose, isCollapsed, onToggleCollapse }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [userProfile, setUserProfile] = useState({
    full_name: 'User',
    email: 'Loading...',
    identifier: ''
  });

  // Fetch user profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getUserProfile();
        if (response.success) {
          setUserProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    };
    fetchProfile();
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Determine active page from current route
  const getActivePageId = () => {
    const currentPath = location.pathname;
    
    // Special case: new-complaint should highlight manage-complaints
    if (currentPath === '/dashboard/new-complaint') {
      return 'manage-complaints';
    }
    
    const activeItem = navItems.find(item => item.path === currentPath);
    return activeItem ? activeItem.id : 'dashboard';
  };

  const activePage = getActivePageId();

  const handleNavClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex lg:flex-col bg-blue-600 border-r border-blue-700 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        <div className={`flex items-center h-16 border-b border-blue-700 ${
          isCollapsed ? 'justify-center px-4' : 'justify-between px-4'
        }`}>
          <button
            onClick={onToggleCollapse}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shrink-0">
              <span className="text-blue-600 font-bold text-xs">DIS</span>
            </div>
            <span className={`text-white font-semibold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
              isCollapsed ? 'max-w-0 opacity-0' : 'max-w-xs opacity-100'
            }`}>
              Defense Incident Sentinel
            </span>
          </button>
        </div>
        
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-300 ease-in-out group relative ${
                isCollapsed ? 'justify-center' : 'justify-start'
              } ${
                activePage === item.id
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'bg-transparent text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <div className="flex items-center transition-all duration-300 ease-in-out">
                <item.icon className="w-5 h-5 shrink-0" />
                <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out ${
                  isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-3'
                }`}>
                  {item.label}
                </span>
              </div>
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className={`flex items-center px-2 py-3 transition-all duration-300 ease-in-out ${
            isCollapsed ? 'justify-center' : 'justify-start'
          }`}>
            <div className="flex items-center transition-all duration-300 ease-in-out">
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center shrink-0">
                <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
              </div>
              <div className={`flex-1 min-w-0 overflow-hidden transition-all duration-300 ease-in-out ${
                isCollapsed ? 'max-w-0 opacity-0 ml-0' : 'max-w-xs opacity-100 ml-3'
              }`}>
                <p className="text-sm font-medium text-white truncate">{userProfile.full_name}</p>
                <p className="text-xs text-blue-200 truncate">{userProfile.email}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-600 border-r border-blue-700 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-blue-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">DIS</span>
            </div>
            <span className="text-white font-semibold text-sm">Defense Incident Sentinel</span>
          </div>
          <button 
            onClick={onClose}
            className="text-blue-200 hover:text-white lg:hidden"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activePage === item.id
                  ? 'bg-white text-blue-600 font-semibold shadow-sm'
                  : 'text-blue-100 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-blue-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{userProfile.full_name}</p>
              <p className="text-xs text-blue-200 truncate">{userProfile.email}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
