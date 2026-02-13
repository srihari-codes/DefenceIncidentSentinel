import { createContext, useContext } from 'react';

const SidebarContext = createContext({
  isCollapsed: false,
});

export const useSidebar = () => useContext(SidebarContext);

export default SidebarContext;
