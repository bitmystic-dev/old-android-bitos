import {
  LayoutDashboard, CalendarCheck, Activity, BookOpen, FolderKanban,
  Code2, Sparkles, Settings as SettingsIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  hint: string;
  soon?: boolean;
};

export const NAV: NavItem[] = [
  { to: "/",            label: "Home",        icon: LayoutDashboard, hint: "dash.exe" },
  { to: "/planner",     label: "Planner",     icon: CalendarCheck,   hint: "schedule" },
  { to: "/habits",      label: "Habits",      icon: Activity,        hint: "streaks" },
  { to: "/syllabus",    label: "Syllabus",    icon: BookOpen,        hint: "study" },
  { to: "/projects",    label: "Projects",    icon: FolderKanban,    hint: "kanban" },
  { to: "/code",        label: "Code",        icon: Code2,           hint: "workspace" },
  { to: "/inspiration", label: "Inspiration", icon: Sparkles,        hint: "muse", soon: true },
  { to: "/settings",    label: "Settings",    icon: SettingsIcon,    hint: "config.sys" },
];
