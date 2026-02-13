import { ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { Outlet } from 'react-router-dom';
import SidebarContext from '../contexts/SidebarContext';

export function Layout({ currentPage = 'dashboard' }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed }}>
      <div className="flex h-screen bg-white overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        activePage={currentPage}
        isCollapsed={isCollapsed}
        onToggleCollapse={toggleCollapse}
      />
      
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onMenuClick={toggleSidebar} />
        
        <main className="flex-1 overflow-auto bg-white pb-16 lg:pb-0">
          <Outlet />
        </main>
        
        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </div>
    </SidebarContext.Provider>
  );
}
