// src/lib/icons.ts
import {
  // Core Finance & Money
  Banknote,
  CreditCard,
  Landmark,
  PiggyBank,
  Wallet,
  CircleDollarSign,
  Receipt,
  HandCoins,

  // Charts & Trends
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,

  // Categories: Expenses & Lifestyle
  Home,
  Car,
  Fuel,
  Utensils,
  ShoppingCart,
  GraduationCap,
  HeartPulse,
  Gift,
  Plane,
  Shirt,
  Martini,
  Sprout, // Investments

  // UI & Actions
  ArrowDownUp, // Transactions
  ArrowLeftRight, // Transfers
  Repeat, // Recurring
  Plus,
  Settings,
  Filter,
  Calendar,
  LayoutGrid, // Dashboard
} from "lucide-react";

// The object that maps the icon name to its component
export const ICONS = {
  // Core Finance & Money
  Banknote,
  CreditCard,
  Landmark,
  PiggyBank,
  Wallet,
  CircleDollarSign,
  Receipt,
  HandCoins,

  // Charts & Trends
  TrendingUp,
  TrendingDown,
  LineChart,
  PieChart,

  // Categories: Expenses & Lifestyle
  Home,
  Car,
  Fuel,
  Utensils,
  ShoppingCart,
  GraduationCap,
  HeartPulse,
  Gift,
  Plane,
  Shirt,
  Martini,
  Sprout,

  // UI & Actions
  ArrowDownUp,
  ArrowLeftRight,
  Repeat,
  Plus,
  Settings,
  Filter,
  Calendar,
  LayoutGrid,
};

// The type that represents all available icon names
export type IconName = keyof typeof ICONS;
