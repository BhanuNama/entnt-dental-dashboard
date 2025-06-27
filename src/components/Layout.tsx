
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Header } from '@/components/Header';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { currentUser } = useAuth();

  // Ensure localStorage is properly synced on mount
  useEffect(() => {
    const syncLocalStorage = () => {
      try {
        // Validate localStorage data integrity
        const storedUsers = localStorage.getItem('dental_users');
        const storedPatients = localStorage.getItem('dental_patients');
        const storedIncidents = localStorage.getItem('dental_incidents');
        
        if (!storedUsers || !storedPatients || !storedIncidents) {
          console.log('Initializing missing localStorage data...');
          // The AuthContext will handle initialization
        }
      } catch (error) {
        console.error('Error accessing localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('dental_users');
        localStorage.removeItem('dental_patients');
        localStorage.removeItem('dental_incidents');
        localStorage.removeItem('dental_currentUser');
      }
    };

    syncLocalStorage();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {children}
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-gray-50 to-gray-100">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
