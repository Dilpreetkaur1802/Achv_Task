import { useContext, useState, createContext } from "react";
import { useMediaQuery } from "react-responsive";

const AppContext = createContext();

export function AdminProvder({ children }) {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAdminLoggedIn = () => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{ isMobile, isSidebarOpen, toggleSidebar, isAdminLoggedIn }}>
      {children}
    </AppContext.Provider>
  );
}

export const useAdminContext = () => {
  return useContext(AppContext);
};
