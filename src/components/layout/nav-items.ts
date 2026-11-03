import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  LineChart,
  UserCircle,
  LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Exercise Library", href: "/exercises", icon: BookOpen },
  { label: "Today's Workout", href: "/today", icon: CalendarCheck },
  { label: "Weekly Plan", href: "/weekly", icon: CalendarDays },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Today", href: "/today", icon: CalendarCheck },
  { label: "Week", href: "/weekly", icon: CalendarDays },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserCircle },
];
