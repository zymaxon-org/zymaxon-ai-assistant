import {
  LayoutDashboard, BookOpen, Briefcase, GraduationCap, TrendingUp,
  Code2, Heart, Wallet, BarChart3, Share2, Rocket, Timer, Target,
  CalendarDays, ClipboardList, Moon, Sun, ChevronLeft
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const mainSections = [
  { title: 'Dashboard', url: '/lifeos', icon: LayoutDashboard },
  { title: 'Academics', url: '/lifeos/academics', icon: GraduationCap },
  { title: 'SIWES', url: '/lifeos/siwes', icon: Briefcase },
  { title: 'FYP', url: '/lifeos/fyp', icon: BookOpen },
  { title: 'Career', url: '/lifeos/career', icon: TrendingUp },
  { title: 'Skills', url: '/lifeos/skills', icon: Code2 },
  { title: 'Growth', url: '/lifeos/growth', icon: Heart },
  { title: 'Finance', url: '/lifeos/finance', icon: Wallet },
  { title: 'Forex', url: '/lifeos/forex', icon: BarChart3 },
  { title: 'Social Media', url: '/lifeos/social', icon: Share2 },
  { title: 'Projects', url: '/lifeos/projects', icon: Rocket },
];

const tools = [
  { title: 'Pomodoro', url: '/lifeos/pomodoro', icon: Timer },
  { title: 'Habits', url: '/lifeos/habits', icon: Target },
  { title: 'Schedule', url: '/lifeos/schedule', icon: CalendarDays },
  { title: 'Weekly Review', url: '/lifeos/review', icon: ClipboardList },
];

export function LifeOSSidebar() {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('lifeos-theme', dark ? 'dark' : 'light');
  }, [dark]);

  const isActive = (url: string) => {
    if (url === '/lifeos') return location.pathname === '/lifeos';
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-1">
          {!collapsed && (
            <button onClick={() => navigate('/')} className="flex items-center gap-2 text-sidebar-foreground hover:text-sidebar-primary transition-colors">
              <ChevronLeft className="h-4 w-4" />
              <span className="font-display font-bold text-lg">LifeOS</span>
            </button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setDark(!dark)}>
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Sections</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainSections.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/lifeos'}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {tools.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className="hover:bg-sidebar-accent/50"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="px-2 py-1 text-xs text-muted-foreground text-center">
          {!collapsed && 'LifeOS v1.0'}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
