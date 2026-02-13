import { LayoutDashboard, FileText, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Manage', path: '/dashboard/manage-complaints' },
  { icon: PlusCircle, label: 'New', path: '/dashboard/new-complaint' },
  { icon: MessageSquare, label: 'Chatbot', path: '/dashboard/chatbot' },
  { icon: User, label: 'Profile', path: '/dashboard/settings' },
];

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-blue-600 border-t border-blue-700 z-50">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center justify-center flex-1 gap-1 py-2 rounded-lg transition-colors ${
              isActive(item.path)
                ? 'text-white'
                : 'text-blue-100 hover:text-white'
            }`}
          >
            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
