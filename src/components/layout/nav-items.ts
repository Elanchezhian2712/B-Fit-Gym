import {
  LayoutDashboard,
  Dumbbell,
  BookOpen,
  CalendarCheck,
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
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserCircle },
];

export const mobileNavItems: NavItem[] = [
  { label: "Home", href: "/", icon: LayoutDashboard },
  { label: "Workouts", href: "/workouts", icon: Dumbbell },
  { label: "Today", href: "/today", icon: CalendarCheck },
  { label: "Progress", href: "/progress", icon: LineChart },
  { label: "Profile", href: "/profile", icon: UserCircle },
];
