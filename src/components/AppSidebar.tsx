
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Calendar, Users, FileText, BarChart3, User, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const adminItems = [
  { title: 'Dashboard', url: '/', icon: BarChart3 },
  { title: 'Patients', url: '/patients', icon: Users },
  { title: 'Appointments', url: '/appointments', icon: FileText },
  { title: 'Calendar', url: '/calendar', icon: Calendar },
];

const patientItems = [
  { title: 'My Profile', url: '/profile', icon: User },
  { title: 'My Appointments', url: '/my-appointments', icon: FileText },
];

export function AppSidebar() {
  const { currentUser, logout } = useAuth();
  const { state } = useSidebar();
  const location = useLocation();

  const items = currentUser?.role === 'Admin' ? adminItems : patientItems;
  const isCollapsed = state === 'collapsed';

  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    `w-full justify-start transition-all duration-200 ${
      isActive 
        ? 'bg-primary text-primary-foreground font-medium shadow-sm' 
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <Sidebar className={`${isCollapsed ? 'w-16' : 'w-64'} border-r border-gray-200 bg-white transition-all duration-300`}>
      <SidebarContent>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 dental-gradient rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-5 h-5 bg-white rounded-md opacity-90"></div>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-gray-900 font-poppins text-lg">ENTNT Dental</h2>
                <p className="text-sm text-gray-500 font-inter">Management System</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-4">
          <SidebarGroup>
            <SidebarGroupLabel className="text-gray-500 uppercase tracking-wide text-xs font-semibold font-inter mb-4">
              {currentUser?.role === 'Admin' ? 'Administration' : 'Patient Portal'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-2">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink 
                        to={item.url} 
                        end 
                        className={({ isActive }) => getNavClass({ isActive })}
                      >
                        <item.icon className="h-5 w-5" />
                        {!isCollapsed && <span className="ml-3 font-inter font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate font-poppins">
                {currentUser?.role === 'Admin' ? 'Dr. Admin' : patient?.name || 'Patient'}
              </p>
              <p className="text-xs text-gray-500 truncate font-inter">{currentUser?.email}</p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-inter"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
