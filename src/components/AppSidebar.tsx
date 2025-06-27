
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
    `w-full justify-start ${isActive ? 'bg-blue-100 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-100'}`;

  return (
    <Sidebar className={`${isCollapsed ? 'w-14' : 'w-64'} border-r border-gray-200 bg-white`}>
      <SidebarContent>
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-bold text-gray-900">ENTNT Dental</h2>
                <p className="text-sm text-gray-500">Management System</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 uppercase tracking-wide text-xs font-semibold">
            {currentUser?.role === 'Admin' ? 'Administration' : 'Patient Portal'}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end 
                      className={({ isActive }) => getNavClass({ isActive })}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span className="ml-3">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser?.role === 'Admin' ? 'Dr. Admin' : 'Patient'}
              </p>
              <p className="text-xs text-gray-500 truncate">{currentUser?.email}</p>
            </div>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={logout}
          className="w-full justify-start text-gray-700 hover:bg-gray-100"
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span className="ml-3">Logout</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
