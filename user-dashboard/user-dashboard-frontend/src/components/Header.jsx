import { Menu, Search, Bell, LogOut, User as UserIcon, X } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile } from '../api/user';
import { getComplaints } from '../api/complaint';

export function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

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

  // Fetch recent activities/notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getComplaints({ limit: 5, page: 1 });
        if (response.success && response.data.complaints) {
          // Convert recent complaints to notification format
          const notifs = response.data.complaints.map(complaint => ({
            id: complaint._id,
            title: complaint.status === 'submitted' ? 'Complaint Submitted' : 
                   complaint.status === 'analysing' ? 'Complaint Under Analysis' :
                   complaint.status === 'investigating' ? 'Investigation Started' :
                   'Complaint Updated',
            message: `${complaint.incident_type}: ${complaint.incident_title || 'Untitled'}`,
            time: new Date(complaint.created_at).toLocaleString(),
            status: complaint.status,
            complaint_id: complaint.complaint_id
          }));
          setNotifications(notifs);
          // Count how many are in active status
          const active = notifs.filter(n => n.status !== 'closed').length;
          setUnreadCount(active);
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };
    fetchNotifications();
    
    // Refresh notifications every 2 minutes
    const interval = setInterval(fetchNotifications, 120000);
    return () => clearInterval(interval);
  }, []);

  // Handle search
  useEffect(() => {
    const searchComplaints = async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const response = await getComplaints({ search: searchQuery, limit: 5 });
          if (response.success && response.data.complaints) {
            setSearchResults(response.data.complaints);
            setShowSearchResults(true);
          }
        } catch (error) {
          console.error('Search failed:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
      }
    };

    const debounce = setTimeout(searchComplaints, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchResults(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!userProfile || !userProfile.full_name) return 'U';
    return userProfile.full_name
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
    window.location.href = 'http://localhost:5173';
  };

  const handleComplaintClick = (complaintId) => {
    setShowSearchResults(false);
    setShowNotifications(false);
    navigate(`/dashboard/manage-complaints`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'submitted': return 'bg-blue-100 text-blue-600';
      case 'analysing': return 'bg-yellow-100 text-yellow-600';
      case 'investigating': return 'bg-orange-100 text-orange-600';
      case 'closed': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6">
      <div className="flex items-center gap-4 flex-1">
        {/* Desktop Search */}
        <div ref={searchRef} className="hidden md:block relative flex-1 max-w-md">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by complaint ID or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none flex-1 text-black placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          {/* Search Results Dropdown */}
          {showSearchResults && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              {searchResults.map((complaint) => (
                <button
                  key={complaint._id}
                  onClick={() => handleComplaintClick(complaint._id)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900">#{complaint.complaint_id}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">{complaint.incident_type}</div>
                  <div className="text-sm text-gray-500 truncate">{complaint.incident_title || 'No title'}</div>
                </button>
              ))}
            </div>
          )}
          
          {showSearchResults && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200 z-50 p-4 text-center text-gray-500">
              No complaints found
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Mobile Search Button */}
        <button className="md:hidden text-blue-600 hover:text-blue-700">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div ref={notifRef} className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative text-blue-600 hover:text-blue-700"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-96 overflow-y-auto">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">Recent Activities</h3>
              </div>
              {notifications.length > 0 ? (
                notifications.map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => handleComplaintClick(notif.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">{notif.title}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ml-2 shrink-0 ${getStatusColor(notif.status)}`}>
                        {notif.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-1">{notif.message}</div>
                    <div className="text-xs text-gray-400">#{notif.complaint_id}</div>
                  </button>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  No recent activities
                </div>
              )}
            </div>
          )}
        </div>

        {/* Profile Menu */}
        <div ref={profileRef} className="relative hidden sm:block">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 hover:bg-gray-50 rounded-lg p-1 transition-colors"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">{getUserInitials()}</span>
            </div>
          </button>
          
          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
              <div className="p-4 border-b border-gray-200">
                <div className="font-semibold text-gray-900">{userProfile?.full_name || 'User'}</div>
                <div className="text-sm text-gray-500">{userProfile?.email}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {userProfile?.identifier} • {userProfile?.role}
                </div>
              </div>
              <div className="p-2">
                <button
                  onClick={() => {
                    setShowProfileMenu(false);
                    navigate('/dashboard/settings');
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
